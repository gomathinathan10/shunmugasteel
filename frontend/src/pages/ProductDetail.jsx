import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useQuoteStore } from '../store/quoteStore'
import { cdnImg, PRODUCT_IMAGES } from '../utils/cdn'

const _HR = {
  id: 1, name: 'HR Coils & Sheets', slug: 'hot-rolled-coils-sheets', product_type: 'standard', brand: 'SAIL',
  image_url: 'hot-rolled-coils-sheets-bannerb1f5.jpg', base_price: 58500, stock_status: 'in_stock',
  category_name: 'Flat Products', category_slug: 'flat-products',
  description: 'Hot Rolled Coils and Sheets are primary steel products manufactured by hot rolling process. Ideal for structural applications, fabrication, automotive and general engineering.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: 'IS:2062 / IS:10748' },
    { label: 'Thickness Range', value: '1.6mm – 25mm' },
    { label: 'Width Range', value: '900mm – 2000mm' },
    { label: 'Grade', value: 'E250, E350, E410' },
    { label: 'Surface Finish', value: 'Hot Rolled, Mill Scale' },
    { label: 'Application', value: 'Structural, Fabrication, Automotive' },
  ],
  variants: [
    { id: 1, name: '2mm × 1250mm', thickness: 2, width: 1250, price: 55000 },
    { id: 2, name: '3mm × 1250mm', thickness: 3, width: 1250, price: 57000 },
    { id: 3, name: '5mm × 1500mm', thickness: 5, width: 1500, price: 59000 },
    { id: 4, name: '6mm × 1500mm', thickness: 6, width: 1500, price: 60000 },
    { id: 5, name: '8mm × 2000mm', thickness: 8, width: 2000, price: 62000 },
    { id: 6, name: '10mm × 2000mm', thickness: 10, width: 2000, price: 64000 },
  ],
}
const _CR = {
  id: 2, name: 'CR Coils & Sheets', slug: 'cold-rolled-coils-sheets', product_type: 'standard', brand: 'AMNS',
  image_url: 'cold-rolled-steel072e.jpg', base_price: 72000, stock_status: 'in_stock',
  category_name: 'Flat Products', category_slug: 'flat-products',
  description: 'Cold Rolled Coils and Sheets offer superior surface finish and tighter tolerances, ideal for automotive panels, appliances, furniture and precision fabrication.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: 'IS:513 / IS:1079' },
    { label: 'Thickness Range', value: '0.3mm – 3.2mm' },
    { label: 'Width Range', value: '650mm – 1600mm' },
    { label: 'Grade', value: 'D, DD, EDD, IF' },
    { label: 'Surface Finish', value: 'Bright Annealed, Matte' },
    { label: 'Application', value: 'Automotive, Appliances, Furniture' },
  ],
  variants: [
    { id: 1, name: '0.5mm × 1000mm', thickness: 0.5, width: 1000, price: 70000 },
    { id: 2, name: '0.8mm × 1200mm', thickness: 0.8, width: 1200, price: 71000 },
    { id: 3, name: '1.0mm × 1250mm', thickness: 1.0, width: 1250, price: 72000 },
    { id: 4, name: '1.2mm × 1250mm', thickness: 1.2, width: 1250, price: 73000 },
    { id: 5, name: '1.5mm × 1500mm', thickness: 1.5, width: 1500, price: 74000 },
  ],
}

const _GP = {
  id: 3, name: 'GP Sheets & Coils', slug: 'gp-sheets-coils', product_type: 'standard', brand: 'JSW',
  image_url: 'gpsheetcoilc6bd.jpg', base_price: 85000, stock_status: 'in_stock',
  category_name: 'Flat Products', category_slug: 'flat-products',
  description: 'Galvanized Plain (GP) steel sheets and coils are cold rolled steel coated with zinc for corrosion protection. Certified to IS 277 standard with 120–275 GSM coating.',
  gst_rate: 18,
  specs: [
    { label: 'Standard', value: 'IS:277' },
    { label: 'Zinc Coating', value: '120 GSM – 275 GSM' },
    { label: 'Thickness Range', value: '0.20mm – 3.0mm' },
    { label: 'Width Range', value: '600mm – 1500mm' },
    { label: 'Surface Finish', value: 'Regular Spangle / Zero Spangle' },
    { label: 'Application', value: 'Roofing, HVAC ducts, Cladding, Automotive' },
  ],
  variants: [
    { id: 1, name: '0.40mm × 1000mm', thickness: 0.4, width: 1000, price: 83000 },
    { id: 2, name: '0.50mm × 1220mm', thickness: 0.5, width: 1220, price: 84000 },
    { id: 3, name: '0.80mm × 1220mm', thickness: 0.8, width: 1220, price: 85000 },
    { id: 4, name: '1.00mm × 1220mm', thickness: 1.0, width: 1220, price: 86000 },
    { id: 5, name: '1.20mm × 1250mm', thickness: 1.2, width: 1250, price: 87000 },
  ],
}

const _PPGL = {
  id: 5, name: 'PPGL Colour Coated Coils', slug: 'ppgl-colour-coated-coils', product_type: 'standard', brand: 'AMNS',
  image_url: 'Color-Coated-Coilsb58b.jpg', base_price: 95000, stock_status: 'in_stock',
  category_name: 'Flat Products', category_slug: 'flat-products',
  description: 'Pre-Painted Galvalume (PPGL) steel coils feature an alloy coating of 55% Aluminium and 45% Zinc with factory-applied multi-layer paint. Available in 30+ colours.',
  gst_rate: 18,
  specs: [
    { label: 'Substrate', value: 'Al-Zn Alloy Coated Steel (AZ150)' },
    { label: 'Standard', value: 'IS:15965 / ASTM A792' },
    { label: 'Thickness Range', value: '0.30mm – 1.0mm' },
    { label: 'Width Range', value: '900mm – 1250mm' },
    { label: 'Paint System', value: 'RMP / SMP (Top: 20-25µ, Primer: 5µ)' },
    { label: 'Application', value: 'Industrial Roofing, Wall Cladding, Architectural Panels' },
  ],
  variants: [
    { id: 1, name: '0.45mm × 1220mm — Off White', thickness: 0.45, width: 1220, price: 94000 },
    { id: 2, name: '0.50mm × 1220mm — Sky Blue', thickness: 0.50, width: 1220, price: 95000 },
    { id: 3, name: '0.50mm × 1220mm — Mist Green', thickness: 0.50, width: 1220, price: 95000 },
    { id: 4, name: '0.60mm × 1220mm — Castle Red', thickness: 0.60, width: 1220, price: 97000 },
  ],
}

const _GPSLIT = {
  id: 6, name: 'GP Slitted Coils', slug: 'gp-slitted-coils', product_type: 'custom', brand: 'JSW',
  image_url: 'gp-slit-coil-952cf2f.jpg', base_price: null, stock_status: 'in_stock',
  category_name: 'Flat Products', category_slug: 'flat-products',
  description: 'Galvanized Plain slitted coils precision-slit to customer-specified widths for tube mills, cable trays, roll-forming, and stamping operations.',
  gst_rate: 18,
  specs: [
    { label: 'Standard', value: 'IS:277' },
    { label: 'Zinc Coating', value: '120 GSM – 275 GSM' },
    { label: 'Thickness', value: '0.30mm – 3.0mm' },
    { label: 'Slit Width Range', value: '20mm – 600mm' },
    { label: 'Slit Tolerance', value: '±0.1mm' },
    { label: 'Application', value: 'ERW Pipes, Cable Trays, Roll Forming, Stamping' },
  ],
  variants: [
    { id: 1, name: 'Slit Width 50mm — 1.0mm thk', thickness: 1.0, width: 50, price: 87000 },
    { id: 2, name: 'Slit Width 100mm — 1.2mm thk', thickness: 1.2, width: 100, price: 87000 },
    { id: 3, name: 'Slit Width 150mm — 1.5mm thk', thickness: 1.5, width: 150, price: 87000 },
  ],
}

const _CRSLIT = {
  id: 7, name: 'CR Slitted Coils', slug: 'cr-slitted-coils', product_type: 'custom', brand: 'Evonith',
  image_url: '0-25mm-cold-rolled-coil-1000x1000cf88.jpg', base_price: null, stock_status: 'in_stock',
  category_name: 'Flat Products', category_slug: 'flat-products',
  description: 'Cold Rolled precision slitted coils produced to tight width tolerances with burr-free edges. Ideal for precision automotive stamping and electrical enclosures.',
  gst_rate: 18,
  specs: [
    { label: 'Standard', value: 'IS:513 CR1 / CR2 / CR3' },
    { label: 'Thickness', value: '0.25mm – 2.5mm' },
    { label: 'Slit Width', value: '15mm – 600mm' },
    { label: 'Edge Finish', value: 'Deburred / Slit Edge' },
    { label: 'Application', value: 'Automotive brackets, Tubes, Hinges, Electrical parts' },
  ],
  variants: [
    { id: 1, name: 'Slit Width 40mm — 0.8mm thk', thickness: 0.8, width: 40, price: 74000 },
    { id: 2, name: 'Slit Width 80mm — 1.0mm thk', thickness: 1.0, width: 80, price: 74000 },
    { id: 3, name: 'Slit Width 120mm — 1.2mm thk', thickness: 1.2, width: 120, price: 74000 },
  ],
}

const _GC = {
  id: 4, name: 'Galvanized Corrugated Sheets', slug: 'galvanized-corrugated-sheets', product_type: 'standard', brand: 'SAIL',
  image_url: 'galvanized-corrugated-sheets7d36.jpg', base_price: 80000, stock_status: 'in_stock',
  category_name: 'Roofing Solutions', category_slug: 'roofing-products',
  description: 'Galvanized Corrugated (GC) sheets manufactured from IS 277 certified cold-rolled steel with uniform zinc coating. Excellent weather resistance, lightweight, and durable.',
  gst_rate: 18,
  specs: [
    { label: 'Standard', value: 'IS:277 / IS:12583' },
    { label: 'Zinc Coating', value: '120 GSM – 180 GSM' },
    { label: 'Thickness', value: '0.45mm – 0.80mm' },
    { label: 'Width', value: '800mm / 900mm / 1000mm' },
    { label: 'Lengths Available', value: '6ft, 8ft, 10ft, 12ft, 14ft' },
    { label: 'Application', value: 'Industrial sheds, Warehouses, Boundary walls, Farm buildings' },
  ],
  variants: [
    { id: 1, name: '0.45mm × 1000mm × 8ft (120 GSM)', thickness: 0.45, width: 1000, price: 800 },
    { id: 2, name: '0.50mm × 1000mm × 10ft (120 GSM)', thickness: 0.50, width: 1000, price: 1050 },
    { id: 3, name: '0.63mm × 1000mm × 12ft (180 GSM)', thickness: 0.63, width: 1000, price: 1450 },
  ],
}

const _DECK = {
  id: 8, name: 'Steel Decking Sheets', slug: 'steel-decking-sheets', product_type: 'custom', brand: 'Evonith',
  image_url: 'decking-sheets-17e37.jpg', base_price: null, stock_status: 'in_stock',
  category_name: 'Roofing Solutions', category_slug: 'roofing-products',
  description: 'Steel Deck Sheets for composite flooring in commercial and multi-storey buildings. Custom lengths and profiles available. Price calculated based on dimensions and quantity.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: 'Galvanized Steel / Galvalume' },
    { label: 'Profile', value: '44mm / 52mm / 76mm Rib Depth' },
    { label: 'Zinc Coating', value: '120–275 g/m²' },
    { label: 'Standard Width', value: '600mm, 750mm, 900mm, 1020mm' },
    { label: 'Length', value: 'Custom cut to size (up to 12m)' },
    { label: 'Application', value: 'Composite Concrete Slabs, Mezzanines, High-Rise Floors' },
  ],
}

const _PUF = {
  id: 9, name: 'PUF Panels', slug: 'puf-sandwich-panels', product_type: 'custom', brand: 'JSW',
  image_url: 'PUF Panels8be3.png', base_price: null, stock_status: 'in_stock',
  category_name: 'Roofing Solutions', category_slug: 'roofing-products',
  description: 'Polyurethane Foam sandwich panels with steel facings for insulated roofing, cold storage, industrial sheds and clean rooms.',
  gst_rate: 18,
  specs: [
    { label: 'Core Material', value: 'Rigid CFC-Free Polyurethane Foam (PUF)' },
    { label: 'Density', value: '40 ± 2 kg/m³' },
    { label: 'Facing Sheet', value: '0.5mm PPGI / PPGL both sides' },
    { label: 'Panel Thickness', value: '30mm, 40mm, 50mm, 60mm, 80mm, 100mm' },
    { label: 'Effective Width', value: '1000mm nominal' },
    { label: 'Application', value: 'Cold Storage, Controlled Atmospheres, Pharma Units, Warehouses' },
  ],
}

const _UPVC = {
  id: 10, name: 'UPVC Roofing Sheets', slug: 'upvc-roofing-sheets', product_type: 'custom', brand: 'JSW',
  image_url: 'UPVC Sheet46e3.png', base_price: null, stock_status: 'in_stock',
  category_name: 'Roofing Solutions', category_slug: 'roofing-products',
  description: '3-layer co-extruded UPVC roofing sheets featuring UV-resistant ASA surface layer, cellular PVC core for thermal insulation, and high-impact bottom layer. 100% rust-proof and chemical-resistant.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: '3-Layer Co-Extruded UPVC with ASA Coating' },
    { label: 'Thickness', value: '2.0mm, 2.5mm, 3.0mm' },
    { label: 'Width', value: '1070mm (Effective 1000mm)' },
    { label: 'Length', value: 'Custom cut to size' },
    { label: 'Thermal Conductivity', value: '0.14 W/mK' },
    { label: 'Application', value: 'Chemical Factories, Coastal Warehouses, Electroplating Units, Animal Sheds' },
  ],
  variants: [
    { id: 1, name: '2.0mm Corrugated UPVC Sheet — White', thickness: 2.0, width: 1070, price: 450 },
    { id: 2, name: '2.5mm Corrugated UPVC Sheet — Blue', thickness: 2.5, width: 1070, price: 550 },
    { id: 3, name: '3.0mm Corrugated UPVC Sheet — Terracotta', thickness: 3.0, width: 1070, price: 680 },
  ],
}

const _PC = {
  id: 11, name: 'Polycarbonate Roofing Sheets', slug: 'polycarbonate-roofing-sheets', product_type: 'custom', brand: 'SAIL',
  image_url: 'polycarbonate-sheets-1b014.jpg', base_price: null, stock_status: 'in_stock',
  category_name: 'Roofing Solutions', category_slug: 'roofing-products',
  description: 'High-impact profile and multiwall polycarbonate daylight sheets engineered for industrial skylights. Co-extruded UV layer blocks 99% UV radiation while transmitting up to 85% natural daylight.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: '100% Virgin Sabic / Bayer Polycarbonate Resin' },
    { label: 'Profile', value: 'Trapezoidal / Corrugated matching steel profiles' },
    { label: 'Thickness', value: '1.2mm, 1.5mm, 2.0mm, 3.0mm' },
    { label: 'Light Transmission', value: '85% Clear, 55% Bronze, 45% Opal White' },
    { label: 'UV Resistance', value: 'Co-extruded UV protective layer (both sides)' },
    { label: 'Application', value: 'Factory Skylights, North-Light Glazing, Greenhouses, Canopies' },
  ],
  variants: [
    { id: 1, name: '1.5mm Trapezoidal Profile — Clear', thickness: 1.5, width: 1050, price: 620 },
    { id: 2, name: '2.0mm Trapezoidal Profile — Opal White', thickness: 2.0, width: 1050, price: 780 },
    { id: 3, name: '6mm Multiwall Polycarbonate Sheet', thickness: 6.0, width: 2100, price: 850 },
  ],
}

const _PURLIN = {
  id: 12, name: 'Z & C Purlin', slug: 'z-c-purlin', product_type: 'custom', brand: 'AMNS',
  image_url: 'purlinc517.jpg', base_price: null, stock_status: 'in_stock',
  category_name: 'Roofing Solutions', category_slug: 'roofing-products',
  description: 'Galvanized high-tensile structural Z and C purlins roll-formed with pre-punched holes for rapid on-site bolted construction. Optimized strength-to-weight ratio for PEB sheds.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: 'High Tensile Structural Steel (IS:2062 / S250 / S350)' },
    { label: 'Zinc Coating', value: '120 GSM – 275 GSM' },
    { label: 'Thickness Range', value: '1.5mm – 3.2mm' },
    { label: 'Web Depth', value: '100mm, 150mm, 200mm, 250mm, 300mm' },
    { label: 'Flange Width', value: '50mm – 80mm' },
    { label: 'Application', value: 'PEB Buildings, Industrial Roof Trusses, Wall Girts, Solar Mounting' },
  ],
  variants: [
    { id: 1, name: 'Z Purlin 150×65mm — 2.0mm thk', thickness: 2.0, width: 150, price: 350 },
    { id: 2, name: 'Z Purlin 200×65mm — 2.5mm thk', thickness: 2.5, width: 200, price: 480 },
    { id: 3, name: 'C Purlin 150×65mm — 2.0mm thk', thickness: 2.0, width: 150, price: 350 },
    { id: 4, name: 'C Purlin 200×65mm — 2.5mm thk', thickness: 2.5, width: 200, price: 480 },
  ],
}

const _SCREWS = {
  id: 13, name: 'Roofing Screws', slug: 'roofing-screws', product_type: 'standard', brand: 'SAIL',
  image_url: 'screws1580.jpg', base_price: 3200, stock_status: 'in_stock',
  category_name: 'Accessories', category_slug: 'accessories',
  description: 'Self-drilling hex head screws with high-grade vulcanized EPDM washer for metal roofing. Ruspert corrosion-resistant coating withstands harsh weather conditions.',
  gst_rate: 18,
  specs: [
    { label: 'Standard', value: 'AS 3566 Class 3 / DIN 7504K' },
    { label: 'Coating', value: 'Ruspert 1000-hr Salt Spray Tested' },
    { label: 'Head Type', value: '5/16" Hex Washer Head with Bonded EPDM' },
    { label: 'Drill Capacity', value: 'Up to 12.5mm structural steel' },
    { label: 'Application', value: 'Roof Sheet to Purlin Fixing, Cladding, Composite Slabs' },
  ],
  variants: [
    { id: 1, name: 'HEX 14 × 25mm Self Drilling (1000 pcs/box)', price: 2800 },
    { id: 2, name: 'HEX 14 × 55mm with EPDM (1000 pcs/box)', price: 3200 },
    { id: 3, name: 'HEX 14 × 75mm with EPDM (500 pcs/box)', price: 3600 },
  ],
}

const _TURBO = {
  id: 14, name: 'Turbo Ventilator', slug: 'turbo-ventilator', product_type: 'standard', brand: 'JSW',
  image_url: 'Turbo-Fan12e6.jpg', base_price: 3200, stock_status: 'in_stock',
  category_name: 'Accessories', category_slug: 'accessories',
  description: 'Wind-driven rotary industrial turbo ventilators operating with zero electricity. Efficiently expels hot air, humidity, toxic fumes, and smoke to improve warehouse ventilation.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: 'Aluminium Alloy / Stainless Steel (SS 304)' },
    { label: 'Throat Diameter', value: '21" (530mm) / 24" (600mm)' },
    { label: 'Vanes', value: 'Aerodynamic curved vanes for maximum exhaust torque' },
    { label: 'Bearings', value: 'Double-sealed permanently lubricated bearings' },
    { label: 'Application', value: 'Industrial Sheds, Warehouses, Boiler Rooms, Foundries' },
  ],
  variants: [
    { id: 1, name: '21" (530mm) Aluminium Turbo Ventilator', price: 3200 },
    { id: 2, name: '24" (600mm) Aluminium Turbo Ventilator', price: 3800 },
    { id: 3, name: '24" (600mm) Stainless Steel SS 304', price: 5400 },
  ],
}

const _RA = {
  id: 15, name: 'Roofing Accessories', slug: 'roofing-accessories', product_type: 'standard', brand: 'AMNS',
  image_url: 'roofing-accessories-types0572.jpg', base_price: 1500, stock_status: 'in_stock',
  category_name: 'Accessories', category_slug: 'accessories',
  description: 'Complete range of colour-matched steel roofing trims, ridge caps, corner flashings, barge boards, and gutters to ensure weather-tight finishing of metal roofs.',
  gst_rate: 18,
  specs: [
    { label: 'Material', value: 'Pre-Painted Galvalume / GI Steel (0.45mm – 0.60mm)' },
    { label: 'Length', value: '2.44m (8ft) / 3.0m (10ft) standard' },
    { label: 'Colours', value: 'Matched to all standard PPGL roof sheet shades' },
    { label: 'Application', value: 'Ridge Capping, Gable Flashing, Corner Junctions, Guttering' },
  ],
  variants: [
    { id: 1, name: 'Plain Ridge Cap 450mm girth × 2.44m', price: 450 },
    { id: 2, name: 'Barge Board / Corner Flashing 300mm × 2.44m', price: 380 },
    { id: 3, name: 'Valley Gutter 600mm girth × 2.44m', price: 750 },
    { id: 4, name: 'Eaves Gutter (per meter with brackets)', price: 520 },
  ],
}

const FALLBACK_PRODUCTS = {
  // Flat Products
  'hot-rolled-coils-sheets': _HR,
  'cold-rolled-coils-sheets': _CR,
  'gp-sheets-coils': _GP,
  'ppgl-colour-coated-coils': _PPGL,
  'gp-slitted-coils': _GPSLIT,
  'cr-slitted-coils': _CRSLIT,

  // Roofing Solutions
  'galvanized-corrugated-sheets': _GC,
  'steel-decking-sheets': _DECK,
  'puf-sandwich-panels': _PUF,
  'upvc-roofing-sheets': _UPVC,
  'polycarbonate-roofing-sheets': _PC,
  'z-c-purlin': _PURLIN,

  // Accessories
  'roofing-screws': _SCREWS,
  'turbo-ventilator': _TURBO,
  'roofing-accessories': _RA,

  // Aliases
  'hr-coils-sheets': _HR,
  'cr-coils-sheets': _CR,
  'gp-sheet-coil': _GP,
  'ppgl-color-coated-coils': _PPGL,
  'ppgl-coils': _PPGL,
  'gp-slit-coil': _GPSLIT,
  'cr-slit-coil': _CRSLIT,
  'gc-sheets': _GC,
  'gc-sheet': _GC,
  'decking-sheets': _DECK,
  'puf-panels': _PUF,
  'upvc-sheets': _UPVC,
  'upvc-sheet': _UPVC,
  'polycarbonate-sheets': _PC,
  'purlin': _PURLIN,
  'purlins': _PURLIN,
  'screws': _SCREWS,
  'turbo-ventilators': _TURBO,
}


export default function ProductDetail() {
  const { productSlug } = useParams()
  const navigate = useNavigate()
  const addItem = useQuoteStore((s) => s.addItem)

  const initialFb = FALLBACK_PRODUCTS[productSlug] || null
  const [product, setProduct] = useState(initialFb)
  const [loading, setLoading] = useState(!initialFb)
  const [selectedVariant, setSelectedVariant] = useState(initialFb?.variants?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [addedMsg, setAddedMsg] = useState('')
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [activeMedia, setActiveMedia] = useState(
    initialFb?.image_url ? { type: 'image', src: cdnImg(initialFb.image_url), id: 'primary' } : null
  )
  const videoRef = useRef(null)

  // Custom product dimensions
  const [customThick, setCustomThick] = useState('')
  const [customWidth, setCustomWidth] = useState('')
  const [customLength, setCustomLength] = useState('')
  const [customQty, setCustomQty] = useState(1)
  const [calcResult, setCalcResult] = useState(null)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    const fb = FALLBACK_PRODUCTS[productSlug]
    if (fb && (!product || product.slug !== productSlug)) {
      setProduct(fb)
      if (fb.variants?.length) setSelectedVariant(fb.variants[0])
      const src = cdnImg(fb.image_url || PRODUCT_IMAGES[productSlug] || '')
      if (src) setActiveMedia({ type: 'image', src, id: 'primary' })
      setLoading(false)
    }

    productService.getProductBySlug(productSlug)
      .then((res) => {
        const d = res.data?.data || res.data
        if (d && d.name) {
          setProduct(d)
          if (d.variants?.length) setSelectedVariant(d.variants[0])
          const firstImg = d.primary_image || d.images?.[0]?.image_url
          if (firstImg) setActiveMedia({ type: 'image', src: firstImg, id: 'primary' })
        }
      })
      .catch(() => {
        if (fb) {
          setProduct(fb)
          if (fb.variants?.length) setSelectedVariant(fb.variants[0])
          const src = cdnImg(fb.image_url || PRODUCT_IMAGES[productSlug] || '')
          if (src) setActiveMedia({ type: 'image', src, id: 'primary' })
        }
      })
      .finally(() => setLoading(false))
  }, [productSlug])

  const handleCalculate = async () => {
    if (!customThick || !customWidth || !customLength || !customQty) return
    setCalculating(true)
    try {
      const res = await productService.calculatePrice({
        product_id: product.id,
        thickness: parseFloat(customThick),
        width: parseFloat(customWidth),
        length: parseFloat(customLength),
        quantity: parseInt(customQty),
      })
      setCalcResult(res.data?.data || res.data)
    } catch {
      // Fallback calculation: weight (MT) = thickness(m) × width(m) × length(m) × density(7.85 T/m³) × qty
      const weight_mt = (parseFloat(customThick) / 1000) * (parseFloat(customWidth) / 1000) * parseFloat(customLength) * 7.85 * parseFloat(customQty)
      setCalcResult({ weight_mt: weight_mt.toFixed(3), estimated: true })
    }
    setCalculating(false)
  }

  const handleAddStandard = () => {
    if (!selectedVariant) return
    addItem({
      product: { id: product.id, name: product.name, slug: product.slug },
      variant: { id: selectedVariant.id, name: selectedVariant.variant_name || selectedVariant.name },
      quantity,
      unit: selectedVariant.unit || 'MT',
      unit_price: selectedVariant.price_per_unit || selectedVariant.price || 0,
      total_price: (selectedVariant.price_per_unit || selectedVariant.price || 0) * quantity,
      specs: selectedVariant.variant_name || selectedVariant.name,
      is_custom: false,
    })
    setAddedMsg('Added to quote basket!')
    setTimeout(() => setAddedMsg(''), 2000)
  }

  const handleAddCustom = () => {
    if (!customThick || !customWidth || !customLength || !customQty) return
    const specs = `${customThick}mm × ${customWidth}mm × ${customLength}m × Qty ${customQty}`

    const apiItem   = calcResult?.items?.[0]
    const unitPrice = apiItem?.unit_price  || 0
    const totalPrice = apiItem?.total_price || (calcResult?.subtotal ?? 0)
    const unit      = apiItem?.unit || 'Sheets'

    addItem({
      product: { id: product.id, name: product.name, slug: product.slug },
      variant: null,
      quantity: parseInt(customQty),
      unit,
      unit_price: unitPrice,
      total_price: totalPrice,
      specs,
      is_custom: true,
    })
    setAddedMsg(unitPrice > 0 ? 'Added to quote basket!' : 'Added! Our team will confirm pricing.')
    setTimeout(() => setAddedMsg(''), 3000)
  }

  if (loading) return <div className="min-h-96 flex items-center justify-center text-gray-400 text-sm">Loading product...</div>
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
      <Link to="/" style={{ color: '#E67E22' }} className="mt-4 inline-block">Back to Home</Link>
    </div>
  )

  const isStandard = product.product_type === 'standard' || product.product_type === 'both'
  const isCustom   = product.product_type === 'custom'   || product.product_type === 'both'
  const gst = product.gst_rate || 18

  const stdPrice = selectedVariant?.price_per_unit || selectedVariant?.price || product.base_price || product.starting_price
  const stdTotal = stdPrice * quantity
  const stdGst = (stdTotal * gst) / 100

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10" style={{ paddingTop: '110px' }}>
      {/* Back button + Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
          style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
        >
          &#8592; Back
        </button>
        <nav className="text-sm text-gray-400 flex flex-wrap items-center gap-1">
          <Link to="/" className="hover:text-orange-400">Home</Link>
          <span className="mx-2">&#8250;</span>
          <Link to={'/products/' + (product.category_slug || 'flat-products')} className="hover:text-orange-400">{product.category_name || 'Products'}</Link>
          <span className="mx-2">&#8250;</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          {(() => {
            const fallbackSrc = cdnImg(product.image_url || PRODUCT_IMAGES[productSlug] || '')
            const images = product.images?.length
              ? product.images
              : (product.primary_image || fallbackSrc)
                ? [{ id: 'primary', image_url: product.primary_image || fallbackSrc, is_primary: 1 }]
                : []
            const videos = product.videos || []
            const allMedia = [
              ...images.map((img) => ({ type: 'image', src: img.image_url || img.image_path, id: img.id })),
              ...videos.map((vid) => ({ type: 'video', src: vid.video_url || vid.video_path, id: vid.id, title: vid.title })),
            ]
            const current = activeMedia || allMedia[0]

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Main viewer */}
                <div style={{ flex: 1 }}>
                  <div className="rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!current || current.type === 'image' ? (
                      <img
                        src={current?.src || fallbackSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect fill="%232C3E50" width="600" height="600"/><text fill="%23E67E22" font-size="20" font-family="sans-serif" x="300" y="310" text-anchor="middle">Steel Product</text></svg>' }}
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        src={current.src}
                        controls
                        className="w-full h-full"
                        style={{ objectFit: 'contain', background: '#000', maxHeight: '100%' }}
                      />
                    )}
                  </div>

                  {/* Stock + Brand badges */}
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {product.brand && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg">
                        Brand: <strong>{product.brand}</strong>
                      </span>
                    )}
                    <span className={`inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg ${product.stock_status === 'in_stock' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {product.stock_status === 'in_stock' ? '● In Stock' : '● On Order'}
                    </span>
                    {isCustom && <span className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700">Custom / Made to Order</span>}
                  </div>
                </div>

                {/* Thumbnail strip — horizontal on all screens */}
                {allMedia.length > 1 && (
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {allMedia.map((m) => {
                      const isActive = current?.id === m.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setActiveMedia(m); if (videoRef.current) videoRef.current.pause() }}
                          style={{
                            width: 72, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                            border: isActive ? '2px solid #E67E22' : '2px solid #e5e7eb',
                            background: '#f3f4f6', padding: 0, cursor: 'pointer', position: 'relative',
                          }}
                        >
                          {m.type === 'image' ? (
                            <img src={m.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <>
                              <video src={m.src} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} muted />
                              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', background: 'rgba(0,0,0,0.35)' }}>▶</span>
                            </>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

              </div>
            )
          })()}
        </div>

        {/* Info panel */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Specs table */}
          {product.specs?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Product Specifications</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                {product.specs.map((s, i) => (
                  <div key={i} className={`flex text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="w-28 sm:w-40 px-3 sm:px-4 py-2.5 font-medium text-gray-500 border-r border-gray-200 flex-shrink-0">{s.spec_name || s.label}</div>
                    <div className="flex-1 px-4 py-2.5 text-gray-800">{s.spec_value || s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Standard product: variant selector ── */}
          {isStandard && (
            <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Select Variant & Quantity</h3>

              {product.variants?.length === 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  Pricing not yet listed. Our team will confirm the price after you submit your request.
                </div>
              )}

              {product.variants?.length > 0 && (() => {
                // Collect unique brands that have variants
                const brands = [...new Set(
                  product.variants.map((v) => v.brand).filter(Boolean)
                )]
                const hasBrands = brands.length > 0
                const activeBrand = hasBrands ? (selectedBrand || brands[0]) : null
                const filteredVariants = hasBrands
                  ? product.variants.filter((v) => v.brand === activeBrand)
                  : product.variants

                return (
                  <>
                    {/* Brand chips */}
                    {hasBrands && (
                      <div className="mb-4">
                        <label className="text-sm text-gray-500 block mb-2">Brand</label>
                        <div className="flex flex-wrap gap-2">
                          {brands.map((b) => {
                            const isActive = (selectedBrand || brands[0]) === b
                            return (
                              <button
                                key={b}
                                type="button"
                                onClick={() => {
                                  setSelectedBrand(b)
                                  const first = product.variants.find((v) => v.brand === b)
                                  setSelectedVariant(first || null)
                                }}
                                style={{
                                  padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.15s',
                                  background: isActive ? '#E67E22' : '#fff',
                                  color: isActive ? '#fff' : '#374151',
                                  border: isActive ? '2px solid #E67E22' : '2px solid #d1d5db',
                                }}
                              >{b}</button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dimension / Size dropdown filtered by brand */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-500 block mb-1">Dimension / Size</label>
                      <select
                        value={selectedVariant?.id || ''}
                        onChange={(e) => {
                          const v = filteredVariants.find((v) => v.id === parseInt(e.target.value))
                          setSelectedVariant(v)
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                      >
                        {filteredVariants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.variant_name || v.name}
                            {(v.price_per_unit || v.price) > 0 ? ` — ₹${Number(v.price_per_unit || v.price).toLocaleString('en-IN')}/${v.unit || 'MT'}` : ' — Price on Request'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )
              })()}

              <div className="mb-4">
                <label className="text-sm text-gray-500 block mb-1">Quantity (MT)</label>
                <input
                  type="number" min="1" value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>

              {stdPrice && (
                <div className="border-t border-gray-200 pt-4 mb-4 space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Unit Price</span>
                    <span>{'\u20b9'}{Number(stdPrice).toLocaleString('en-IN')}/MT</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({quantity} MT)</span>
                    <span>{'\u20b9'}{Number(stdTotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>GST ({gst}%)</span>
                    <span>+ {'\u20b9'}{Number(stdGst).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Total (incl. GST)</span>
                    <span style={{ color: '#E67E22' }}>{'\u20b9'}{Number(stdTotal + stdGst).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <button
                onClick={product.variants?.length > 0 ? handleAddStandard : handleAddCustom}
                disabled={product.variants?.length > 0 && !selectedVariant}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
              >
                + Add to Quote Basket
              </button>
              {addedMsg && <p className="mt-2 text-sm text-green-600 text-center">{addedMsg}</p>}
            </div>
          )}

          {/* Divider shown only when both sections appear together */}
          {isStandard && isCustom && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR ENTER CUSTOM DIMENSIONS</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
          )}

          {/* ── Custom product: dimension form ── */}
          {isCustom && (
            <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-700 mb-1">Custom Dimensions</h3>
              <p className="text-xs text-gray-500 mb-4">Enter your required dimensions. Price will be calculated based on weight / area.</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Thickness (mm)</label>
                  <input type="number" min="0.1" step="0.1" placeholder="e.g. 0.5" value={customThick} onChange={(e) => setCustomThick(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Width (mm)</label>
                  <input type="number" min="1" placeholder="e.g. 1000" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Length (m)</label>
                  <input type="number" min="0.1" step="0.1" placeholder="e.g. 3.0" value={customLength} onChange={(e) => setCustomLength(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Quantity (Sheets)</label>
                  <input type="number" min="1" placeholder="e.g. 100" value={customQty} onChange={(e) => setCustomQty(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              <button onClick={handleCalculate} disabled={calculating || !customThick || !customWidth || !customLength || !customQty} className="w-full py-2 rounded-lg text-sm font-semibold text-white mb-3 disabled:opacity-50" style={{ background: '#2C3E50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {calculating ? 'Calculating...' : 'Calculate Weight / Price'}
              </button>

              {calcResult && (
                <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200 text-sm">
                  {calcResult.estimated && <p className="text-xs text-amber-600 mb-2">&#9888; Estimated — final price confirmed by our team</p>}
                  {calcResult.weight_mt && <div className="flex justify-between text-gray-600"><span>Estimated Weight</span><strong>{calcResult.weight_mt} MT</strong></div>}
                  {calcResult.subtotal && <div className="flex justify-between text-gray-600 mt-1"><span>Subtotal</span><strong>{'\u20b9'}{Number(calcResult.subtotal).toLocaleString('en-IN')}</strong></div>}
                  {calcResult.gst_amount && <div className="flex justify-between text-gray-600 mt-1"><span>GST ({gst}%)</span><strong>{'\u20b9'}{Number(calcResult.gst_amount).toLocaleString('en-IN')}</strong></div>}
                  {calcResult.total && <div className="flex justify-between font-bold text-gray-800 mt-1 pt-1 border-t"><span>Total</span><span style={{ color: '#E67E22' }}>{'\u20b9'}{Number(calcResult.total).toLocaleString('en-IN')}</span></div>}
                </div>
              )}

              <button onClick={handleAddCustom} disabled={!customThick || !customWidth || !customLength || !customQty} className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50" style={{ background: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={(e) => e.currentTarget.style.background = '#d35400'} onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}>
                + Add to Quote Basket
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">Our team will confirm pricing within 2 hours</p>
              {addedMsg && <p className="mt-2 text-sm text-green-600 text-center">{addedMsg}</p>}
            </div>
          )}

          {/* GST notice */}
          <p className="mt-3 text-xs text-gray-400">* Prices shown are exclusive of GST ({gst}%). GST will be added at checkout.</p>
        </div>
      </div>

      {/* View Basket CTA */}
      <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
        <p className="text-sm text-gray-600">Items added to your quote basket will be sent to our team for review.</p>
        <Link to="/quote-basket" className="text-sm font-semibold whitespace-nowrap ml-4" style={{ color: '#E67E22' }}>View Quote Basket &rarr;</Link>
      </div>
    </div>
  )
}
