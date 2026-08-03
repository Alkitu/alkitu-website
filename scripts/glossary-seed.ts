/**
 * Seeds the glossary with the terms the existing posts already talk about.
 *
 * These three are deliberately chosen from `Desarrollo Web`, where the hosting,
 * domain and SSL posts cross-reference each other constantly in prose but never
 * link to each other — exactly the gap the interlinking is meant to close.
 *
 * Idempotent: upserts on `slug`, so re-running is safe.
 */

import { agentClient } from '../lib/agent/client';
import { checkGlossaryContract } from '../lib/schemas/glossary';

const TERMS = [
  {
    slug: 'certificado-ssl',
    titulo_es: 'Certificado SSL',
    titulo_en: 'SSL certificate',
    definicion_es:
      'Un certificado SSL es un archivo digital que autentica la identidad de un sitio web y cifra la información que viaja entre el navegador y el servidor. Es lo que convierte una dirección http:// en https:// y hace aparecer el candado en la barra del navegador.',
    definicion_en:
      'An SSL certificate is a digital file that authenticates a website’s identity and encrypts the data travelling between the browser and the server. It is what turns an http:// address into https:// and puts the padlock in the browser bar.',
    dominio: 'Desarrollo Web',
    pilar: 'Infraestructura web',
    aliases: ['certificado de seguridad', 'SSL/TLS', 'certificado digital'],
    campo_semantico: ['cifrado', 'https', 'seguridad web', 'autoridad certificadora'],
    relacionados: [
      { nombre: 'Hosting web', slug: 'hosting-web' },
      { nombre: 'Dominio web', slug: 'dominio-web' },
    ],
    geo_preguntas: [
      '¿Qué es un certificado SSL?',
      '¿Es obligatorio tener un certificado SSL?',
      '¿Cuánto cuesta un certificado SSL?',
    ],
    geo_respuestas: [
      'Un certificado SSL es un archivo digital que cifra la comunicación entre el navegador y el servidor, y verifica que el sitio es quien dice ser.',
      'No es obligatorio por ley, pero sí en la práctica: los navegadores marcan como «no seguro» cualquier sitio sin él y Google lo usa como factor de posicionamiento desde 2014.',
      'Puede ser gratuito. Let’s Encrypt emite certificados de validación de dominio sin coste, y la mayoría de hostings los incluyen y renuevan automáticamente.',
    ],
    geo_respuesta_corta:
      'Un certificado SSL cifra la comunicación entre el navegador y el servidor y verifica la identidad del sitio; es lo que habilita https:// y el candado del navegador.',
    estado: 'completo',
    published: true,
  },
  {
    slug: 'hosting-web',
    titulo_es: 'Hosting web',
    titulo_en: 'Web hosting',
    definicion_es:
      'El hosting web es el servicio que almacena los archivos de un sitio en un servidor conectado a internet y los entrega a quien los solicita. Sin hosting el sitio existe como código en un ordenador, pero no es accesible públicamente.',
    definicion_en:
      'Web hosting is the service that stores a site’s files on an internet-connected server and serves them on request. Without hosting a site exists as code on a machine, but is not publicly reachable.',
    dominio: 'Desarrollo Web',
    pilar: 'Infraestructura web',
    aliases: ['alojamiento web', 'servidor web', 'alojamiento'],
    campo_semantico: ['servidor', 'ancho de banda', 'uptime', 'CDN'],
    hiponimos: [{ nombre: 'Hosting compartido', slug: 'hosting-compartido' }],
    relacionados: [
      { nombre: 'Dominio web', slug: 'dominio-web' },
      { nombre: 'Certificado SSL', slug: 'certificado-ssl' },
    ],
    geo_preguntas: [
      '¿Qué es el hosting web?',
      '¿Cuál es la diferencia entre hosting y dominio?',
    ],
    geo_respuestas: [
      'El hosting web es el servicio que guarda los archivos de un sitio en un servidor conectado a internet y los sirve cuando alguien visita la página.',
      'El dominio es la dirección y el hosting es el espacio: el dominio indica dónde buscar el sitio, el hosting es dónde vive realmente.',
    ],
    geo_respuesta_corta:
      'El hosting web es el servicio que almacena los archivos de un sitio en un servidor conectado a internet y los entrega cuando alguien lo visita.',
    estado: 'completo',
    published: true,
  },
  {
    slug: 'dominio-web',
    titulo_es: 'Dominio web',
    titulo_en: 'Web domain',
    definicion_es:
      'Un dominio web es la dirección legible que identifica a un sitio en internet (por ejemplo alkitu.com). Funciona como un alias del sistema DNS sobre la dirección IP real del servidor, que es la que los humanos no memorizan.',
    definicion_en:
      'A web domain is the human-readable address that identifies a site on the internet (for example alkitu.com). It acts as a DNS alias over the server’s actual IP address, which is the part nobody memorises.',
    dominio: 'Desarrollo Web',
    pilar: 'Infraestructura web',
    aliases: ['nombre de dominio', 'dirección web'],
    campo_semantico: ['DNS', 'registrador', 'TLD', 'subdominio'],
    relacionados: [
      { nombre: 'Hosting web', slug: 'hosting-web' },
      { nombre: 'Certificado SSL', slug: 'certificado-ssl' },
    ],
    geo_preguntas: ['¿Qué es un dominio web?', '¿Quién es el dueño de un dominio?'],
    geo_respuestas: [
      'Un dominio web es la dirección legible que identifica un sitio en internet y que el DNS traduce a la dirección IP del servidor.',
      'Un dominio no se compra, se alquila: se registra por periodos anuales ante un registrador acreditado y se conserva mientras se renueve.',
    ],
    geo_respuesta_corta:
      'Un dominio web es la dirección legible de un sitio (alkitu.com) que el sistema DNS traduce a la dirección IP real del servidor.',
    estado: 'completo',
    published: true,
  },
];

async function main() {
  const supabase = agentClient();

  for (const term of TERMS) {
    // Same gate the admin UI and the API route use — a seed must not be able to
    // introduce a term the editor would have rejected.
    const findings = checkGlossaryContract(term);
    const errors = findings.filter((f) => f.level === 'error');
    if (errors.length) {
      console.error(`✗ ${term.slug}`);
      errors.forEach((e) => console.error(`    ${e.field}: ${e.message}`));
      process.exitCode = 1;
      return;
    }

    const { error } = await supabase
      .from('glossary_terms')
      .upsert(term, { onConflict: 'slug' });

    if (error) {
      console.error(`✗ ${term.slug}: ${error.message}`);
      process.exitCode = 1;
      return;
    }

    const warnings = findings.filter((f) => f.level === 'warning').length;
    console.log(`✓ ${term.slug}${warnings ? `  (${warnings} warning(s))` : ''}`);
  }

  const { count } = await supabase
    .from('glossary_terms')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  console.log(`\n${count} published term(s) in the glossary.`);
}

main();
