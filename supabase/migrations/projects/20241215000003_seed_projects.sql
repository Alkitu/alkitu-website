-- =====================================================
-- Seed Projects Data
-- =====================================================
-- Description: Auto-generated migration to seed projects from seed.json
-- Created: 2025-12-14
-- Total Projects: 16
-- =====================================================

-- Temporary table to store category mappings
CREATE TEMP TABLE temp_category_map (
  slug text PRIMARY KEY,
  id uuid
);

-- Populate category map
INSERT INTO temp_category_map (slug, id)
SELECT slug, id FROM categories;

-- Insert projects
INSERT INTO projects (
  legacy_id,
  slug,
  title_en,
  title_es,
  description_en,
  description_es,
  about_en,
  about_es,
  image,
  gallery,
  tags,
  urls,
  is_active,
  display_order
) VALUES
  (
    1, -- legacy_id
    'proyect_1', -- slug
    'Tangle', -- title_en
    'Tangle', -- title_es
    'After completing the bootcamp at "Ironhack," I had the opportunity to do remote internships in English for 4 months at an innovative startup based in Amsterdam, the Netherlands. My contribution included executing two projects, with the standout being the creation of a website.

The initial concept for the website was designed in Figma by another team member. My task was to bring this design to life, selecting the most appropriate stack for the company''s needs. Given the prevailing familiarity within the team with the MERN stack, I chose to develop the website using NextJS, aiming to improve its indexing on major browsers.

It is relevant to note that a few months after the project''s completion, REACT announced its recommendation to choose one of the popular React-based frameworks in the community, among which NextJS is included. This fact validates the strategic choice made during the project development, reaffirming the quality and relevance of the selected technology.', -- description_en
    'Después de completar el bootcamp en "Ironhack," tuve la oportunidad de realizar prácticas remotas en inglés durante 4 meses en una innovadora startup con sede en Ámsterdam, Países Bajos. Mi contribución incluyó la ejecución de dos proyectos, destacándose entre ellos la creación de una página web.

La concepción inicial de la página web fue diseñada en Figma por otro miembro del equipo. Mi tarea consistió en llevar a la realidad este diseño, seleccionando el Stack más apropiado para las necesidades de la empresa. Dada la familiaridad predominante en el equipo con el Stack MERN, opté por desarrollar la página web utilizando NextJS, con el objetivo de mejorar su indexación en los principales navegadores.

Es relevante señalar que unos meses después de la finalización del proyecto, REACT anunció su recomendación de elegir uno de los frameworks basados en React populares en la comunidad, entre los cuales se encuentra NextJS. Este hecho valida la elección estratégica realizada durante el desarrollo del proyecto, reafirmando la calidad y pertinencia de la tecnología seleccionada.', -- description_es
    'Tangle is a university social ecosystem that connects students within the same institution, combating loneliness in the cities across the globe.', -- about_en
    'Tangle is a university social ecosystem that connects students within the same institution, combating loneliness in the cities across the globe.', -- about_es
    'https://lh3.googleusercontent.com/d/1qr-X_JG0VnWBh1ncGPAKT5UOOtv1Ymg8', -- image
    '["https://lh3.googleusercontent.com/d/1qr-X_JG0VnWBh1ncGPAKT5UOOtv1Ymg8","https://lh3.googleusercontent.com/d/19Ng3G4Za14TpnTTe5XwnHGwuxNyfkDjE","https://lh3.googleusercontent.com/d/1ciFTzstT9VjlXUhZxDfcId2DteYhhVqe","https://lh3.googleusercontent.com/d/1pWujZJgHVAxCyB-7Tzot7fQTTgUoBCng"]'::jsonb, -- gallery
    '["GitHub","NextJS","NodeJS","ExpressJS","TailwindCSS","Framer_Motion","ESlint"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://tangle-offline-website.vercel.app"},{"name":"Repository:","fallback":"","active":true,"url":"https://github.com/LuisEUM/tangle-offline-website"}]'::jsonb, -- urls
    true, -- is_active
    1 -- display_order (using legacy_id as order)
  ),
  (
    2, -- legacy_id
    'proyect_2', -- slug
    'Top Top', -- title_en
    'Top Top', -- title_es
    'In my third project during the Ironhack web development bootcamp, I created a mobile web application that served as a social platform for exploring nearby restaurants, adding them to favorites, and accessing their menus and reservations.

This work expanded the capabilities of my previous project, which focused on CRUD for digital menus and restaurants, by introducing a new reservations service, significantly enhancing its value for users and establishments. This experience reinforced my ability to design more sophisticated web solutions, showcasing my proficiency in using MVC, React, and libraries like Bootstrap and Framer Motion, gradually solidifying my position as a competent and versatile full-stack developer.', -- description_en
    'En mi tercer proyecto durante el bootcamp de programación web en Ironhack, creé una aplicación web móvil que servía como una plataforma social para explorar restaurantes cercanos, añadirlos a favoritos y acceder a sus menús y reservas.

Este trabajo amplió las capacidades de mi proyecto previo, que se centraba en el CRUD de menús y restaurantes digitales, al introducir un nuevo servicio de reservas, mejorando significativamente su valor para usuarios y establecimientos. Esta experiencia reforzó mi habilidad para diseñar soluciones web más sofisticadas, demostrando mi destreza en el uso de MVC, React y bibliotecas como Bootstrap y Framer Motion, consolidándome cada vez un poco más como un desarrollador full-stack competente y versátil.', -- description_es
    'Top Top Restaurants is a mobile web application that redefines the dining experience by allowing users to discover nearby restaurants as if it were a social network, and easily manage reservations.          ', -- about_en
    'Top Top Restaurants es una aplicación web móvil que redefine la experiencia gastronómica al permitir a los usuarios descubrir restaurantes cercanos como si fuese una red social, y gestionar reservas fácilmente.', -- about_es
    'https://lh3.googleusercontent.com/d/1RXElI694I-yzJCrVeOXfZIPO6A29peFc', -- image
    '["https://lh3.googleusercontent.com/d/1RXElI694I-yzJCrVeOXfZIPO6A29peFc","https://lh3.googleusercontent.com/d/1S1RowUGmlYH1acdEEP17Xl_zhyXubt-C","https://lh3.googleusercontent.com/d/12u3dFEUBzBQUA5SB_lrLqf88JQc5f_YH"]'::jsonb, -- gallery
    '["GitHub","MongoDB","ExpressJS","ReactJS","NodeJS","Bootstrap","Framer_Motion","Axios","Docker"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://toprestaurant-production.up.railway.app"},{"name":"Repository:","fallback":"","active":true,"url":"https://github.com/LuisEUM/TopRestaurant"}]'::jsonb, -- urls
    true, -- is_active
    2 -- display_order (using legacy_id as order)
  ),
  (
    3, -- legacy_id
    'proyect_3', -- slug
    'Big Menu', -- title_en
    'Big Menu', -- title_es
    'My second project in the Ironhack web development bootcamp was the creation of a web application designed for digital menu management in restaurants or restaurant chains. This web app allows CRUD operations (Create, Read, Update, Delete) on menus, making it easy for owners to efficiently update and maintain their culinary offerings in real-time.

For the backend logic, I implemented the Model-View-Controller (MVC) design pattern, enabling a clear and efficient code structure as well as a separation of responsibilities within the application. This architecture was crucial for keeping the project organized and facilitating its scalability.

This project not only showcases my ability to integrate various technologies in the development of complex web solutions but also demonstrates my understanding of design patterns like MVC for creating structured and maintainable web applications.', -- description_en
    'Mi segundo proyecto en el bootcamp de programación web de Ironhack fue el desarrollo de una aplicación web diseñada para la gestión de menús digitales para restaurantes o cadenas de restaurantes. Esta web app permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los menús, facilitando a los propietarios la actualización y mantenimiento de sus ofertas culinarias de manera eficiente y en tiempo real.

Para la lógica del backend, implementé el patrón de diseño Modelo Vista Controlador (MVC), lo que permitió una estructuración clara y eficiente del código, así como una separación de responsabilidades dentro de la aplicación. Esta arquitectura fue clave para mantener el proyecto organizado y facilitar su escalabilidad.

Este proyecto no solo refleja mi habilidad para integrar diversas tecnologías en la creación de soluciones web complejas sino que también demuestra mi comprensión de patrones de diseño como MVC para desarrollar aplicaciones web estructuradas y mantenibles.', -- description_es
    'Big Menu is a desktop web application for the efficient management of digital menus in restaurants. It enables owners to update their culinary offerings in real-time with simple operations. The MVC architecture ensures organized code and scalability.', -- about_en
    'Big Menu es una aplicación web para ordenadores que se engarga de la gestión eficiente de menús digitales en restaurantes. Facilita a los dueños la actualización en tiempo real de sus ofertas culinarias con operaciones sencillas.', -- about_es
    'https://lh3.googleusercontent.com/d/1C_ICEORfRBZdiHL83SSLJ4CU-bmOX_xO', -- image
    '["https://lh3.googleusercontent.com/d/1C_ICEORfRBZdiHL83SSLJ4CU-bmOX_xO","https://lh3.googleusercontent.com/d/17YCzGhjqYyqm7I71UEhk6KyugGdIwLIt","https://lh3.googleusercontent.com/d/1Ygw70YJKxNi7cJGLXYsO3l5vwU-NKcQW","https://lh3.googleusercontent.com/d/1l5WbgKgbjUvTeQwPmcvtAzB3TYXtk0MG","https://lh3.googleusercontent.com/d/1JFbuVDf9_xEwDwvFn081oAxpSJ25mAvg","https://lh3.googleusercontent.com/d/1SMG5982fnJTPqtUTr6sLMsu3PMOzdCnB"]'::jsonb, -- gallery
    '["GitHub","MongoDB","ExpressJS","NodeJS","Handlebars","Bootstrap"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://menuproject-production.up.railway.app"},{"name":"Repository:","fallback":"","active":true,"url":"https://github.com/theBigMenu/menuProject"}]'::jsonb, -- urls
    true, -- is_active
    3 -- display_order (using legacy_id as order)
  ),
  (
    4, -- legacy_id
    'proyect_4', -- slug
    'Gousty', -- title_en
    'Gousty', -- title_es
    'In my first project during the web development bootcamp at Ironhack, I took on the challenge of creating a computer game. I used HTML5 and JavaScript to develop the game logic and manipulate objects on the canvas, complemented by CSS3 for the design and layout of the interface. GitHub served as the version control platform, while environment and character graphics were created using Adobe Illustrator. This project not only showcases my ability to combine front-end development with graphic design but also culminates in an interactive game that reflects my competence in integrating web technologies and design tools.

I deeply appreciate Pedro Salazar for his support in the final stage. Together, in just 3 weeks, we fulfilled a childhood dream by creating this video game, while managing other work commitments. Effective task coordination and the ability to work as a team under pressure were crucial in meeting this challenge in such a short time, demonstrating our passion and commitment to the realization of innovative projects.', -- description_en
    'En mi primer proyecto durante el bootcamp de programación web en Ironhack, tomé el desafío de crear un videojuego para ordenador. Utilicé HTML5 y JavaScript para desarrollar la lógica del juego y manipular objetos en canvas, complementando con CSS3 para el diseño y maquetación de la interfaz. GitHub sirvió como plataforma de control de versiones, mientras que los gráficos de ambiente y personajes fueron creados con Adobe Illustrator. Este proyecto no solo evidencia mi capacidad para combinar desarrollo front-end con diseño gráfico, sino que también culmina en un juego interactivo que refleja mi competencia en integrar tecnologías web y herramientas de diseño.

Agradezco profundamente a Pedro Salazar por su apoyo en la etapa final. Juntos, y en solo 3 semanas, realizamos un sueño de infancia creando este videojuego, mientras manejábamos otros compromisos laborales. La coordinación efectiva de tareas y la capacidad para trabajar en equipo bajo presión fueron fundamentales para cumplir con este desafío en tan corto tiempo, evidenciando nuestra pasión y compromiso por la realización de proyectos innovadores.', -- description_es
    '''Gousty, The Ghost'' is a vibrant platformer mini-game set in a dark forest, filled with challenging Slimes. Control Gousty with the keyboard, using his special abilities to confront enemies and overcome levels. An intense adventure awaits you, where strategy and skill are essential.', -- about_en
    '''Gousty, The Ghost'' es un vibrante mini-juego de plataforma ambientado en un bosque oscuro, lleno de Slimes desafiantes. Controla a Gousty con el teclado, usando sus habilidades especiales para enfrentarte a los enemigos y superar los niveles. Una aventura intensa te espera, donde estrategia y habilidad son esenciales.', -- about_es
    'https://lh3.googleusercontent.com/d/11KXaqoKlk3VYGlavOUXPcLBEk2xJchJA', -- image
    '["https://lh3.googleusercontent.com/d/11KXaqoKlk3VYGlavOUXPcLBEk2xJchJA","https://lh3.googleusercontent.com/d/10hjDtQrfg7f1QjykAwNS4cLOBsEBN5bs","https://lh3.googleusercontent.com/d/17ynA1GtyIRvx0gPRiSv_PweAsLREdOFp","https://lh3.googleusercontent.com/d/1fhL0TcgnlqUfAS8hye36jbfR6X9D_Oto","https://lh3.googleusercontent.com/d/1qKuBLPf9E8_4LZh7m28-nMzN6CesQTZr"]'::jsonb, -- gallery
    '["Adobe_Illustrator","GitHub","HTML5","CSS3","JavaScript"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://alkitu.com/gousty"},{"name":"Repository:","fallback":"","active":true,"url":"https://github.com/LuisEUM/Gousty_the_ghost"}]'::jsonb, -- urls
    true, -- is_active
    4 -- display_order (using legacy_id as order)
  ),
  (
    5, -- legacy_id
    'proyect_5', -- slug
    'Desierto Sahara Trips', -- title_en
    'Desierto Sahara Trips', -- title_es
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- description_en
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1adXiKkTYUmuFTlS3Ex6CclMHNW6tSsZg', -- image
    '["https://lh3.googleusercontent.com/d/1adXiKkTYUmuFTlS3Ex6CclMHNW6tSsZg","https://lh3.googleusercontent.com/d/1MuW7QxrzissTy7Ow7YgEdChlqMEAANxJ","https://lh3.googleusercontent.com/d/14URj68lMDloQnnDwTplw57Ks3beNssLC","https://lh3.googleusercontent.com/d/13XEwUmQ0pUyi0s1FwaJ3Z370PifPj7Qg"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://desiertosaharatrips.com"}]'::jsonb, -- urls
    true, -- is_active
    5 -- display_order (using legacy_id as order)
  ),
  (
    6, -- legacy_id
    'proyect_6', -- slug
    'Canastilla', -- title_en
    'Canastilla', -- title_es
    'Gracias a Valeria Urdaneta por su apoyo en el diseño de la web.', -- description_en
    'Gracias a Valeria Urdaneta por su apoyo en el diseño de la web.', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1-t-HT1z7AJmNf0S-cympMXkGtAZu37lZ', -- image
    '["https://lh3.googleusercontent.com/d/1-t-HT1z7AJmNf0S-cympMXkGtAZu37lZ","https://lh3.googleusercontent.com/d/1Ktf170Y6Og3no71Fbds1b2O_vmKoQlDq","https://lh3.googleusercontent.com/d/1nyD8i0ssApLxf0EgyTUcH310v6EXjyQi","https://lh3.googleusercontent.com/d/1yzHAslHc-AnVey0kyN5aI8ouqAwK8NCU"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://canastilla.com.es"}]'::jsonb, -- urls
    true, -- is_active
    6 -- display_order (using legacy_id as order)
  ),
  (
    7, -- legacy_id
    'proyect_7', -- slug
    'Eleale', -- title_en
    'Eleale', -- title_es
    'Cleaning company that likes to provide 100% satisfaction to  commercial, residential, business, and more.', -- description_en
    'Empresa estadounidense de limpieza que le gusta proporcionar el 100% de satisfacción a comerciales, residenciales, empresas, y más.', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1ZgGszKCks1OHYZVHK3ZMA3E96cBkfc0m', -- image
    '["https://lh3.googleusercontent.com/d/1ZgGszKCks1OHYZVHK3ZMA3E96cBkfc0m","https://lh3.googleusercontent.com/d/1Ce7MfpsrWQHT-mnD99volqg8Fxtfklsj","https://lh3.googleusercontent.com/d/1rYNPXHbB8RkUhnUREtNIuTdmL9a823iU","https://lh3.googleusercontent.com/d/1uCF1HC5CAJmTuL4YSzCr-EcBF067E9f3"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator"]'::jsonb, -- tags
    '[{"name":"Website:","url":"https://elealecleaning.com"}]'::jsonb, -- urls
    true, -- is_active
    7 -- display_order (using legacy_id as order)
  ),
  (
    8, -- legacy_id
    'proyect_8', -- slug
    'Funda Manía', -- title_en
    'Funda Manía', -- title_es
    'description', -- description_en
    'description', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/18iIa7Wr2XGKn-gtCXSI_oQQNLAiHUrW2', -- image
    '["https://lh3.googleusercontent.com/d/18iIa7Wr2XGKn-gtCXSI_oQQNLAiHUrW2","https://lh3.googleusercontent.com/d/1yaq3OfUOXvc1GRyXA2Q2t5-EgTzpHV0d","https://lh3.googleusercontent.com/d/1048ldkUAJ8o9o_FsCj23LtJdg7Yt3iiH","https://lh3.googleusercontent.com/d/1Jkxa67fJkGd7kDyQpaTIlnDwUrAXGJqT"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://funda-mania.com"}]'::jsonb, -- urls
    true, -- is_active
    8 -- display_order (using legacy_id as order)
  ),
  (
    9, -- legacy_id
    'proyect_9', -- slug
    'El Mejor Vidente', -- title_en
    'El Mejor Vidente', -- title_es
    'description', -- description_en
    'description', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1sk_St7kGZ5LS_myymE2PeUrrcocbvEYc', -- image
    '["https://lh3.googleusercontent.com/d/1sk_St7kGZ5LS_myymE2PeUrrcocbvEYc","https://lh3.googleusercontent.com/d/1x9EudmANa3sq0zj1_NPRLz7-0iXm9Icy","https://lh3.googleusercontent.com/d/1IiI54okRN2goYieaONEuoNlE__H2rEZN","https://lh3.googleusercontent.com/d/1_cQNzk4iP3vcwYfERdb0wZ0iWouo9RX6"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://elmejorvidente.es"}]'::jsonb, -- urls
    true, -- is_active
    9 -- display_order (using legacy_id as order)
  ),
  (
    10, -- legacy_id
    'proyect_10', -- slug
    'Clínica Diseño y Sonrisas', -- title_en
    'Clínica Diseño y Sonrisas', -- title_es
    'description', -- description_en
    'description', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1ytUvXx7WWmc5r7PEMq8aKGIe_KpwZSsh', -- image
    '["https://lh3.googleusercontent.com/d/1ytUvXx7WWmc5r7PEMq8aKGIe_KpwZSsh","https://lh3.googleusercontent.com/d/1w3IQVq91jLeYDR16dfzzl8b0124Y-114","https://lh3.googleusercontent.com/d/1cGLd8iEGbz-UI0eeiRgg-hvhgONDN1Un","https://lh3.googleusercontent.com/d/1pvjKOvId8o1alSu6QZKfbkcCkqdJPwyE"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"http://clinicadysdental.com"}]'::jsonb, -- urls
    true, -- is_active
    10 -- display_order (using legacy_id as order)
  ),
  (
    11, -- legacy_id
    'proyect_11', -- slug
    'Tránsito Bar', -- title_en
    'Tránsito Bar', -- title_es
    'Gracias especiales para Valeria Urdaneta por su colaboracion en el diseño de la web.', -- description_en
    'Gracias especiales para Valeria Urdaneta por su colaboracion en el diseño de la web.', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1VSaQ40emziHCyQPqXlh9l6y7vbtyjoQ9', -- image
    '["https://lh3.googleusercontent.com/d/1VSaQ40emziHCyQPqXlh9l6y7vbtyjoQ9","https://lh3.googleusercontent.com/d/15_u_j6y2RRwDCEJyu07pX8g8gXbS53T9","https://lh3.googleusercontent.com/d/119mFMANIrFS2wlwq26pLwhSP9KjIoKQk","https://lh3.googleusercontent.com/d/1lLJ37eHKRnKOorB1sfOnRJ-jGCOzh-CQ","https://lh3.googleusercontent.com/d/180EMdSBVV1_gSbUgH15TtwdCPaRRhAVP"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator","Adobe_InDesign","Photography","Adobe_PhotoShop"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://transitobar.es"}]'::jsonb, -- urls
    true, -- is_active
    11 -- display_order (using legacy_id as order)
  ),
  (
    12, -- legacy_id
    'proyect_12', -- slug
    'Aircrew Aviation', -- title_en
    'Aircrew Aviation', -- title_es
    'Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.', -- description_en
    'Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1XyK6mGS1NHuIlaQ4W9rKNdVYG29kwsjm', -- image
    '["https://lh3.googleusercontent.com/d/1XyK6mGS1NHuIlaQ4W9rKNdVYG29kwsjm","https://lh3.googleusercontent.com/d/1rSCAqks6m9y2pk4ypWgpUrnJHZjXuFmK","https://lh3.googleusercontent.com/d/1_odeMm6yPY4OPdT725ykpCs4Rc7SICzz","https://lh3.googleusercontent.com/d/1xl0vWLf6X7cv2R88FOrzBIjJ9w64AvTr"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"Project transferred in january 2024.","active":true,"url":"https://aircrewaviation.com"}]'::jsonb, -- urls
    true, -- is_active
    12 -- display_order (using legacy_id as order)
  ),
  (
    13, -- legacy_id
    'proyect_13', -- slug
    'Detailcar', -- title_en
    'Detailcar', -- title_es
    'description', -- description_en
    'description', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/17Dyw_OLNuZ_u7iOwmqQBMDO78dJy2EIW', -- image
    '["https://lh3.googleusercontent.com/d/17Dyw_OLNuZ_u7iOwmqQBMDO78dJy2EIW","https://lh3.googleusercontent.com/d/1-RoT8byn8YOwSPgm-eKsZ8muLYl4ljVq","https://lh3.googleusercontent.com/d/1OAPma210Hw_a40PWoqXZxKjhZ1mK-OyE","https://lh3.googleusercontent.com/d/1dniq83waQ2qPnN6uCWS8t7n8lcVriHJo"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"","active":true,"url":"https://detailcar.es"}]'::jsonb, -- urls
    true, -- is_active
    13 -- display_order (using legacy_id as order)
  ),
  (
    14, -- legacy_id
    'proyect_14', -- slug
    'Helayor', -- title_en
    'Helayor', -- title_es
    'description', -- description_en
    'description', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1KQmSw20mgfrQ78QyQ7sTq-Yf1bfF3GVd', -- image
    '["https://lh3.googleusercontent.com/d/1KQmSw20mgfrQ78QyQ7sTq-Yf1bfF3GVd","https://lh3.googleusercontent.com/d/1NxyHQAvqNlglZ-i_Dk_zShYnuChDTBDH","https://lh3.googleusercontent.com/d/1-QTUZkA4BYSSwcAJAKRrs6Rd39_Of7-N","https://lh3.googleusercontent.com/d/1Dd5ETwnJny_3k27iVh9VjxFSBGJ92LYg","https://lh3.googleusercontent.com/d/1BsjfnELAMGSFscbkg1OvzDMtQEXAjxsL","https://lh3.googleusercontent.com/d/1g90eCSaeORhb3f0wRJhu1-jUeORsTdt4"]'::jsonb, -- gallery
    '["HTML5","CSS3","JavaScript","WordPress","Elementor","Adobe_Illustrator","Adobe_InDesign","Adobe_PhotoShop"]'::jsonb, -- tags
    '[{"name":"Website","fallback":"Project halted due to the separation of partners from the company.","active":false,"url":"https://www.helayorpersonalizacion.net"}]'::jsonb, -- urls
    true, -- is_active
    14 -- display_order (using legacy_id as order)
  ),
  (
    15, -- legacy_id
    'proyect_15', -- slug
    'Ernesto Fuenmayor', -- title_en
    'Ernesto Fuenmayor', -- title_es
    'description', -- description_en
    'description', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1WNH2TApngkV0ECaMPWWZ6nhQpP664hMW', -- image
    '["https://lh3.googleusercontent.com/d/1WNH2TApngkV0ECaMPWWZ6nhQpP664hMW","https://lh3.googleusercontent.com/d/1bDcUNykCEwAmNztTU3M3lt3fL8V32gKV","https://lh3.googleusercontent.com/d/1LOmVpGtME3wzLJZK6EyOrajFoI3NnhBS","https://lh3.googleusercontent.com/d/1b_Zv4cXEYdfHz_IYSzya3J55q6xNjFTi"]'::jsonb, -- gallery
    '["Adobe_Illustrator","Adobe_After_Effects"]'::jsonb, -- tags
    '[{"name":"Youtube (Video):","fallback":"","active":true,"url":"https://youtu.be/8A0cttGm-r0?si=E0CulEHtwjXS63J5"}]'::jsonb, -- urls
    true, -- is_active
    15 -- display_order (using legacy_id as order)
  ),
  (
    16, -- legacy_id
    'proyect_16', -- slug
    'Ciutat de las Artes y las Ciencias', -- title_en
    'Ciutat de las Artes y las Ciencias', -- title_es
    'description', -- description_en
    'description', -- description_es
    NULL, -- about_en
    NULL, -- about_es
    'https://lh3.googleusercontent.com/d/1vU5JcpdyKIJteUbMQM0K_VRoRqpGx8pI', -- image
    '["https://lh3.googleusercontent.com/d/1vU5JcpdyKIJteUbMQM0K_VRoRqpGx8pI","https://lh3.googleusercontent.com/d/1-iwLs17wvWdWk0yRrWE4MVOA40caQX_J","https://lh3.googleusercontent.com/d/1GYfkPLERuUdxB0RLOzefQsjeIqmQ8_qf","https://lh3.googleusercontent.com/d/1-ex_oJDqLA3UXRUILXTKJ7bFqFj5j-0E","https://lh3.googleusercontent.com/d/1eglubV4R80-W56e1egAJonrpChfVSgnH","https://lh3.googleusercontent.com/d/1I23xQKo0LhMSw7roDzBjNepZ7C0J7DR7","https://lh3.googleusercontent.com/d/1gSvpEdnwUskqj0nB-JKTowx-zsr84Lqs","https://lh3.googleusercontent.com/d/1G8nnny2rqOEMcmNFZI4H11IIypIDQzer","https://lh3.googleusercontent.com/d/1gQG2mHOP6BwTURiZ6TNLfKOa6q2910iL","https://lh3.googleusercontent.com/d/1XwsM04e5rk2_l36R17Tu9ZI3K9tgv1Pp","https://lh3.googleusercontent.com/d/19d31tq4CsV9dIsZMNxoTno_x_YvOSJYR","https://lh3.googleusercontent.com/d/1crugRPuiLNO6vvkJPsHe7qxj4XDKG0IW","https://lh3.googleusercontent.com/d/1IRyo8Kg5rEuV6KJ4t_OduId6YGxAjPfJ","https://lh3.googleusercontent.com/d/1P6NHneMdKkp2sfWJ9PnwBRvU9C5cbkCo","https://lh3.googleusercontent.com/d/1wK1OMOFva5Ou2xAVOJB9gOmUycuKXbRB","https://lh3.googleusercontent.com/d/1YDf5o9s_0enyQovht64T6VT6Ba3ADrPz"]'::jsonb, -- gallery
    '["Figma","Adobe_Premiere"]'::jsonb, -- tags
    '[{"name":"Youtube (Video):","fallback":"","active":true,"url":"https://youtu.be/ke4Q96SN2Hg?si=cM4o-ErCWHPX824G"},{"name":"Flow del Prototipo para Mobile:","fallback":"","active":true,"url":"https://tinyurl.com/29y7z6a9"},{"name":"Flow del Prototipo para Desktop:","fallback":"","active":true,"url":"https://tinyurl.com/5n7zwhxm"},{"name":"Proyecto completo en Figma:","fallback":"","active":true,"url":"https://tinyurl.com/ynfm2uje"},{"name":"Página original:","fallback":"","active":true,"url":"https://www.cac.es/va/home.html"}]'::jsonb, -- urls
    true, -- is_active
    16 -- display_order (using legacy_id as order)
  )
ON CONFLICT (slug) DO NOTHING;

-- Create project-category associations
INSERT INTO project_categories (project_id, category_id)
SELECT
  p.id as project_id,
  c.id as category_id
FROM (VALUES
  ('proyect_1', 'web_development'),
  ('proyect_1', 'web_apps'),
  ('proyect_2', 'web_development'),
  ('proyect_2', 'web_design'),
  ('proyect_2', 'web_apps'),
  ('proyect_3', 'web_development'),
  ('proyect_3', 'web_design'),
  ('proyect_3', 'web_apps'),
  ('proyect_4', 'web_development'),
  ('proyect_4', 'web_apps'),
  ('proyect_4', 'web_design'),
  ('proyect_4', 'video_games'),
  ('proyect_5', 'web_development'),
  ('proyect_5', 'web_design'),
  ('proyect_5', 'logos'),
  ('proyect_5', 'branding'),
  ('proyect_5', 'seo'),
  ('proyect_6', 'web_development'),
  ('proyect_6', 'web_design'),
  ('proyect_6', 'branding'),
  ('proyect_6', 'seo'),
  ('proyect_7', 'web_development'),
  ('proyect_7', 'web_design'),
  ('proyect_7', 'logos'),
  ('proyect_7', 'branding'),
  ('proyect_7', 'seo'),
  ('proyect_8', 'web_development'),
  ('proyect_8', 'web_design'),
  ('proyect_8', 'seo'),
  ('proyect_9', 'web_development'),
  ('proyect_9', 'web_design'),
  ('proyect_9', 'logos'),
  ('proyect_9', 'branding'),
  ('proyect_9', 'seo'),
  ('proyect_9', 'sem'),
  ('proyect_10', 'web_development'),
  ('proyect_10', 'web_design'),
  ('proyect_10', 'seo'),
  ('proyect_11', 'web_development'),
  ('proyect_11', 'seo'),
  ('proyect_11', 'audiovisuals'),
  ('proyect_11', 'offline_designs'),
  ('proyect_12', 'web_development'),
  ('proyect_12', 'web_design'),
  ('proyect_12', 'seo'),
  ('proyect_12', 'sem'),
  ('proyect_13', 'web_development'),
  ('proyect_13', 'seo'),
  ('proyect_14', 'web_development'),
  ('proyect_14', 'web_design'),
  ('proyect_14', 'logos'),
  ('proyect_14', 'branding'),
  ('proyect_14', 'seo'),
  ('proyect_14', 'offline_designs'),
  ('proyect_15', 'logos'),
  ('proyect_15', 'branding'),
  ('proyect_15', 'audiovisuals'),
  ('proyect_16', 'web_design'),
  ('proyect_16', 'ux_ui')
) AS data(project_slug, category_slug)
JOIN projects p ON p.slug = data.project_slug
JOIN temp_category_map c ON c.slug = data.category_slug
ON CONFLICT (project_id, category_id) DO NOTHING;

-- Verify insertion
DO $$
DECLARE
  project_count integer;
  association_count integer;
BEGIN
  SELECT COUNT(*) INTO project_count FROM projects;
  SELECT COUNT(*) INTO association_count FROM project_categories;

  RAISE NOTICE '✅ Total projects inserted: %', project_count;
  RAISE NOTICE '✅ Total project-category associations: %', association_count;
END $$;
