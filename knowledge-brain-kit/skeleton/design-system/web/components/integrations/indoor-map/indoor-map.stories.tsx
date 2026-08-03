import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IndoorMapAdmin } from './admin/indoor-map-admin';
import { IndoorMapViewer } from './viewer/indoor-map-viewer';
import type { IndoorMapConfig, MapArea, FloorLevel, AreaCategory, PointOfInterest } from './types';

const meta: Meta = {
  title: 'Integrations/Spatial/Indoor Map',
};
export default meta;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

const demoCategories: AreaCategory[] = [
  { id: 'fashion', name: 'Fashion', color: '#ec4899', icon: '👗' },
  { id: 'food', name: 'Food & Drink', color: '#f97316', icon: '🍔' },
  { id: 'tech', name: 'Technology', color: '#3b82f6', icon: '💻' },
  { id: 'services', name: 'Services', color: '#8b5cf6', icon: '📌' },
  { id: 'entertainment', name: 'Entertainment', color: '#eab308', icon: '🎬' },
  { id: 'health', name: 'Health & Beauty', color: '#14b8a6', icon: '💊' },
  { id: 'home', name: 'Home & Living', color: '#84cc16', icon: '🏠' },
  { id: 'sports', name: 'Sports', color: '#06b6d4', icon: '⚽' },
];

// ---------------------------------------------------------------------------
// Mall floor plan inspired by 'Nivel I.svg' — dark theme, realistic layout
// ---------------------------------------------------------------------------

function createMallFloor(): FloorLevel {
  // Upper wing stores (top row)
  const areas: MapArea[] = [
    // --- TOP WING (upper-left block) ---
    {
      id: 'L-101', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M509.684 163.27V193.255H493.993V163.27H509.684Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 502, centroidY: 178,
      data: { name: 'Sunglass Hut', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-101' },
      status: 'available',
    },
    {
      id: 'L-102', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M509.683 193.022V246.753H493.993V193.022H509.683Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 502, centroidY: 220,
      data: { name: 'Pandora', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-102' },
      status: 'available',
    },
    {
      id: 'L-103', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M509.684 246.516V276.41H493.993V246.516H509.684Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 502, centroidY: 261,
      data: { name: 'Tous', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-103' },
      status: 'available',
    },
    {
      id: 'L-104', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M555.284 163.27V276.414H509.446V163.27H555.284Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 532, centroidY: 220,
      data: { name: 'Nike', categoryId: 'sports', schedule: '10AM - 9PM', location: 'Nivel I, L-104' },
      status: 'available',
    },
    {
      id: 'L-105', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M622.798 163.27V276.414H555.048V163.27H622.798Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 589, centroidY: 220,
      data: { name: 'Zara', categoryId: 'fashion', schedule: '10AM - 10PM', location: 'Nivel I, L-105' },
      status: 'available',
    },
    {
      id: 'L-106', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M671.359 163.27V276.414H646.545V163.27H671.359Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 659, centroidY: 220,
      data: { name: 'GAP', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-106' },
      status: 'occupied',
    },
    {
      id: 'L-107', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M733.84 163.27V276.414H710.802V163.27H733.84Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 722, centroidY: 220,
      data: { name: 'H&M', categoryId: 'fashion', schedule: '10AM - 10PM', location: 'Nivel I, L-107' },
      status: 'available',
    },
    {
      id: 'L-108', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M840.725 163.27V208.362H831.93V214.905H824.352V276.414H779.201V163.27H840.725Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 810, centroidY: 220,
      data: { name: 'Apple Store', categoryId: 'tech', schedule: '10AM - 9PM', location: 'Nivel I, L-108' },
      status: 'available',
    },
    // --- RIGHT WING (middle-right row) ---
    {
      id: 'L-201', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M877.409 320.965V358.362H871.1V373.155H847.457V351.41H852.841V320.965H877.409Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 862, centroidY: 347,
      data: { name: 'Starbucks', categoryId: 'food', schedule: '7AM - 10PM', location: 'Nivel I, L-201' },
      status: 'available',
    },
    {
      id: 'L-202', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M877.408 391.386V421.743H790.092V392.018H875.222V391.386H877.408Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 834, centroidY: 407,
      data: { name: 'Sephora', categoryId: 'health', schedule: '10AM - 9PM', location: 'Nivel I, L-202' },
      status: 'available',
    },
    {
      id: 'L-203', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M877.41 421.503V460.331H831.229V421.503H877.41Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 854, centroidY: 441,
      data: { name: 'MAC', categoryId: 'health', schedule: '10AM - 9PM', location: 'Nivel I, L-203' },
      status: 'available',
    },
    // --- CENTER BLOCK (inner stores) ---
    {
      id: 'L-301', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M682.926 310.903V329.346H655.007V310.903H682.926Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 669, centroidY: 320,
      data: { name: 'Miniso', categoryId: 'home', schedule: '10AM - 9PM', location: 'Nivel I, L-301' },
      status: 'available',
    },
    {
      id: 'L-302', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M682.926 329.106V345.936H655.007V329.106H682.926Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 669, centroidY: 337,
      data: { name: 'Guess', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-302' },
      status: 'available',
    },
    {
      id: 'L-303', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M682.926 345.703V362.999H655.007V345.703H682.926Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 669, centroidY: 354,
      data: { name: 'Lacoste', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-303' },
      status: 'available',
    },
    {
      id: 'L-304', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M682.926 362.756V379.432H655.007V362.756H682.926Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 669, centroidY: 371,
      data: { name: 'Levi\'s', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-304' },
      status: 'available',
    },
    {
      id: 'L-305', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M682.926 395.475V412.927H655.007V395.475H682.926Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 669, centroidY: 404,
      data: { name: 'Adidas', categoryId: 'sports', schedule: '10AM - 9PM', location: 'Nivel I, L-305' },
      status: 'available',
    },
    {
      id: 'L-306', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M682.926 412.686V435.099H655.007V412.686H682.926Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 669, centroidY: 424,
      data: { name: 'Puma', categoryId: 'sports', schedule: '10AM - 9PM', location: 'Nivel I, L-306' },
      status: 'available',
    },
    // --- LEFT WING (lower-left stores) ---
    {
      id: 'L-401', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M145.653 345.569V450.085H98.6484V365.894H46.9443V357.061H31.0156V345.593H31.7656L144.902 345.569H145.653Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 88, centroidY: 398,
      data: { name: 'IKEA Home', categoryId: 'home', schedule: '10AM - 9PM', location: 'Nivel I, L-401' },
      status: 'available',
    },
    {
      id: 'L-402', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M332.617 345.533V449.722H303.189V450.087H282.742V345.546H283.492L331.867 345.533H332.617Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 308, centroidY: 398,
      data: { name: 'Samsung', categoryId: 'tech', schedule: '10AM - 9PM', location: 'Nivel I, L-402' },
      status: 'available',
    },
    {
      id: 'L-403', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M398.52 379.105H421.572V403.134H421.489V519.016H378.841V517.805H362.576V454.961H366.041V341.775L366.261 341.556L388.449 319.37L388.993 318.826L389.522 319.384L398.313 328.637L398.52 328.854V379.105Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 392, centroidY: 420,
      data: { name: 'Mango', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel I, L-403' },
      status: 'available',
    },
    // --- ANCHOR STORE (large upper-left) ---
    {
      id: 'L-001', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M228.858 16.0312V64.6992L244.505 71.6025L245.168 71.8945L244.898 72.5674L231.011 107.181L263.58 122.735L264.266 123.062L263.93 123.743L244.875 162.441L244.669 162.86H230.803V182.172H230.662V280.058L229.914 280.059L92.0957 280.298L61.1934 310.754L60.9746 310.97H16.1113V16.0312H228.858Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 130, centroidY: 160,
      data: { name: 'El Corte Inglés', categoryId: 'fashion', schedule: '10AM - 10PM', location: 'Nivel I, Anchor', description: 'Department store' },
      status: 'available',
    },
    {
      id: 'L-002', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M472.478 93.5508V261.95H414.555V274.938H406.371V262.047H343.375V188.499H338.837V131.284H397.415V93.5508H472.478Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 408, centroidY: 178,
      data: { name: 'Falabella', categoryId: 'fashion', schedule: '10AM - 10PM', location: 'Nivel I, Anchor', description: 'Department store' },
      status: 'available',
    },
    // --- BOTTOM WING ---
    {
      id: 'L-501', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M612.331 526.459H584.262V509.118H566.341V465.211L567.096 465.216L611.586 465.488L612.331 465.493V526.459Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 589, centroidY: 496,
      data: { name: 'Cinnabon', categoryId: 'food', schedule: '10AM - 10PM', location: 'Nivel I, L-501' },
      status: 'available',
    },
    {
      id: 'L-502', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M735.2 482.896V520.593H691.958V482.896H735.2Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 713, centroidY: 502,
      data: { name: 'GNC', categoryId: 'health', schedule: '10AM - 9PM', location: 'Nivel I, L-502' },
      status: 'available',
    },
    // --- CINEMA / LARGE BOTTOM-RIGHT ---
    {
      id: 'L-601', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M872.709 622.874V695.311H866.699V706.404H725.131V622.874H872.709Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 799, centroidY: 665,
      data: { name: 'Cinemark', categoryId: 'entertainment', schedule: '11AM - 12AM', location: 'Nivel I, L-601' },
      status: 'available',
    },
    {
      id: 'L-602', svgPath: '', svgTag: 'path',
      svgAttributes: { d: 'M791.909 494.11V531.315H792.819V531.739H814.628V576.719H815.67V577.289H821.438V623.115H725.131V587.371H629.991V520.358H768.144V519.659H768.671V494.11H791.909Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
      centroidX: 746, centroidY: 560,
      data: { name: 'Food Court', categoryId: 'food', schedule: '10AM - 10PM', location: 'Nivel I, L-602' },
      status: 'available',
    },
  ];

  // Points of Interest
  const pois: PointOfInterest[] = [
    { id: 'poi-restroom-1', type: 'restroom', label: 'Restrooms', x: 520, y: 294 },
    { id: 'poi-restroom-2', type: 'restroom', label: 'Restrooms', x: 743, y: 294 },
    { id: 'poi-elevator-1', type: 'elevator', label: 'Elevator', x: 563, y: 433 },
    { id: 'poi-elevator-2', type: 'elevator', label: 'Elevator', x: 283, y: 318 },
    { id: 'poi-stairs-1', type: 'stairs', label: 'Stairs', x: 692, y: 458 },
    { id: 'poi-escalator-1', type: 'escalator', label: 'Escalator', x: 580, y: 294 },
    { id: 'poi-exit-1', type: 'exit', label: 'Exit', x: 16, y: 315 },
    { id: 'poi-exit-2', type: 'exit', label: 'Exit', x: 891, y: 470 },
    { id: 'poi-info-1', type: 'info', label: 'Info', x: 470, y: 310 },
    { id: 'poi-atm-1', type: 'atm', label: 'ATM', x: 840, y: 480 },
  ];

  return {
    id: 'floor-nivel-i',
    name: 'Nivel I',
    order: 0,
    // Use the background structural elements from the SVG
    svgContent: `
      <rect width="899" height="728" fill="#101213"/>
      <path opacity="0.08" d="M1508.02 1183.91H1778.87V1262.25H1384.9L1234.93 1197.9L1280.81 1089.89L1508.02 1183.91Z" fill="#41484D"/>
      <path d="M493.435 277.12H876.7V322.053H768.112V311.354H654.31V438.264L666.479 450.433H780.95L791.649 461.131H891.175V694.797H873.093L872.335 494.096H769.65L758.484 482.93H650.833L633.047 465.144H566.113V552.165H542.513V540.515H392.162V577.938L289.614 575.923V509.603H277.079V472.827H15.5977V311.624H59.6201L73.5273 299.053L82.0859 311.624H231.327V289.291H355.561L369.334 275.517H472.84V163.719H493.435V277.12Z" fill="#41484D"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M689.865 453.003H683.436L683.436 308.996H689.865V362.919H711.339V383.633H711.907V384.574H830.608V373.184H877.579V391.503H711.907V392.301H711.339V409.602H689.865V453.003Z" fill="#41484D"/>
    `,
    areas,
    viewBox: '0 0 899 728',
    pois,
  };
}

// ---------------------------------------------------------------------------
// Admin — Empty
// ---------------------------------------------------------------------------

export const Admin: StoryObj = {
  render: () => (
    <div className="p-4">
      <IndoorMapAdmin onSave={(config) => console.log('Save indoor map:', config)} />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Admin — Pre-populated
// ---------------------------------------------------------------------------

export const AdminWithData: StoryObj = {
  render: () => {
    const config: IndoorMapConfig = {
      id: 'demo-admin',
      name: 'Demo Mall Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      floors: [createMallFloor()],
      categories: demoCategories,
    };

    return (
      <div className="p-4">
        <IndoorMapAdmin initialConfig={config} onSave={(c) => console.log('Save:', c)} />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Viewer — Shopping Mall (realistic dark theme)
// ---------------------------------------------------------------------------

export const MallViewer: StoryObj = {
  render: () => {
    const config: IndoorMapConfig = {
      id: 'demo-mall',
      name: 'Centro Comercial Plaza',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      floors: [createMallFloor()],
      categories: demoCategories,
    };

    return (
      <div className="p-4 max-w-6xl h-[700px]">
        <IndoorMapViewer
          config={config}
          onAreaClick={(area) => console.log('Area clicked:', area)}
        />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Multi-floor
// ---------------------------------------------------------------------------

export const MultiFloor: StoryObj = {
  render: () => {
    const floor1 = createMallFloor();
    const floor2: FloorLevel = {
      id: 'floor-nivel-ii',
      name: 'Nivel II',
      order: 1,
      svgContent: `<rect width="899" height="728" fill="#101213"/>
        <path d="M493.435 277.12H876.7V322.053H768.112V311.354H654.31V438.264L666.479 450.433H780.95L791.649 461.131H891.175V694.797H873.093L872.335 494.096H769.65L758.484 482.93H650.833L633.047 465.144H566.113V552.165H542.513V540.515H392.162V577.938L289.614 575.923V509.603H277.079V472.827H15.5977V311.624H59.6201L73.5273 299.053L82.0859 311.624H231.327V289.291H355.561L369.334 275.517H472.84V163.719H493.435V277.12Z" fill="#41484D"/>`,
      areas: [
        {
          id: 'f2-L01', svgPath: '', svgTag: 'path',
          svgAttributes: { d: 'M555.284 163.27V276.414H509.446V163.27H555.284Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
          centroidX: 532, centroidY: 220,
          data: { name: 'Forever 21', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel II' },
          status: 'available',
        },
        {
          id: 'f2-L02', svgPath: '', svgTag: 'path',
          svgAttributes: { d: 'M622.798 163.27V276.414H555.048V163.27H622.798Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
          centroidX: 589, centroidY: 220,
          data: { name: 'Pull & Bear', categoryId: 'fashion', schedule: '10AM - 9PM', location: 'Nivel II' },
          status: 'available',
        },
        {
          id: 'f2-L03', svgPath: '', svgTag: 'path',
          svgAttributes: { d: 'M872.709 622.874V695.311H866.699V706.404H725.131V622.874H872.709Z', fill: '#191C1E', stroke: '#8A9297', 'stroke-width': '1.5' },
          centroidX: 799, centroidY: 665,
          data: { name: 'Bowling', categoryId: 'entertainment', schedule: '12PM - 11PM', location: 'Nivel II' },
          status: 'available',
        },
      ],
      viewBox: '0 0 899 728',
      pois: [
        { id: 'f2-poi-restroom', type: 'restroom', label: 'Restrooms', x: 520, y: 294 },
        { id: 'f2-poi-elevator', type: 'elevator', label: 'Elevator', x: 563, y: 433 },
        { id: 'f2-poi-stairs', type: 'stairs', label: 'Stairs', x: 692, y: 458 },
      ],
    };

    const config: IndoorMapConfig = {
      id: 'demo-multi',
      name: 'Centro Comercial Plaza',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      floors: [floor1, floor2],
      categories: demoCategories,
    };

    return (
      <div className="p-4 max-w-6xl h-[700px]">
        <IndoorMapViewer config={config} onAreaClick={(area) => console.log('Area clicked:', area)} />
      </div>
    );
  },
};
