// The one catalog of preset jobs for new orders. A preset is a starting
// point: its concern and services are copied into the new-order form, where
// every line can be edited or removed, and become ordinary
// repair_order_services rows once the order is created.

import type { RepairOrderPriority } from './types'

export const DEFAULT_LABOR_RATE = 120

export interface PresetService {
  name: string
  description: string
  labor_hours: number
  labor_rate: number
  parts_total: number
}

export interface OrderPreset {
  id: string
  name: string
  description: string
  /** Typical time for the whole job, in hours. */
  estimated_hours: number
  concern: string
  priority: RepairOrderPriority
  services: PresetService[]
}

function service(
  name: string,
  description: string,
  labor_hours: number,
  parts_total: number,
  labor_rate: number = DEFAULT_LABOR_RATE,
): PresetService {
  return { name, description, labor_hours, labor_rate, parts_total }
}

export const ORDER_PRESETS: OrderPreset[] = [
  {
    id: 'oil-change',
    name: 'Oil Change',
    description: 'Engine oil and filter change with a quick top-up check.',
    estimated_hours: 0.5,
    concern: 'Customer requests an oil change.',
    priority: 'low',
    services: [
      service('Oil & filter change', 'Drain engine oil, replace oil filter, refill to spec.', 0.5, 45),
      service('Fluid top-up check', 'Check and top up washer, coolant and brake fluid levels.', 0, 0),
    ],
  },
  {
    id: 'pre-purchase-inspection',
    name: 'Pre-Purchase Inspection',
    description: 'Full condition check before the customer buys the vehicle.',
    estimated_hours: 1.5,
    concern: 'Customer requests a pre-purchase inspection.',
    priority: 'medium',
    services: [
      service(
        'Pre-purchase inspection',
        'Multi-point inspection: engine, transmission, brakes, suspension, tyres, body and electrics.',
        1,
        0,
      ),
      service('Road test', 'Road test to check drivability, noises and warning lights.', 0.5, 0),
    ],
  },
  {
    id: 'brake-pads-rotors',
    name: 'Brake Service — Pads & Rotors',
    description: 'Replace brake pads and rotors on one axle.',
    estimated_hours: 2,
    concern: 'Customer reports brake noise or reduced braking.',
    priority: 'high',
    services: [
      service('Brake pads replacement', 'Replace brake pads, clean and lubricate slides.', 1, 80),
      service('Brake rotors replacement', 'Replace brake rotors on the same axle.', 1, 160),
    ],
  },
  {
    id: 'tire-rotation',
    name: 'Tire Rotation',
    description: 'Rotate tyres and set pressures.',
    estimated_hours: 0.5,
    concern: 'Customer requests a tyre rotation.',
    priority: 'low',
    services: [
      service('Tire rotation', 'Rotate tyres, torque wheel nuts, set pressures to spec.', 0.5, 0),
    ],
  },
  {
    id: 'battery-replacement',
    name: 'Battery Replacement',
    description: 'Test and replace the 12V battery.',
    estimated_hours: 0.5,
    concern: 'Customer reports hard starting or a weak battery.',
    priority: 'medium',
    services: [
      service('Battery & charging test', 'Test battery, starter and alternator output.', 0.25, 0),
      service('Battery replacement', 'Replace 12V battery and clean terminals.', 0.25, 180),
    ],
  },
  {
    id: 'wheel-alignment',
    name: 'Wheel Alignment',
    description: 'Four-wheel alignment to spec.',
    estimated_hours: 1,
    concern: 'Customer reports the vehicle pulls or the steering wheel is off-centre.',
    priority: 'medium',
    services: [
      service('Wheel alignment', 'Four-wheel alignment, adjust toe and camber to spec.', 1, 0),
    ],
  },
  {
    id: 'engine-air-filter',
    name: 'Engine Air Filter',
    description: 'Replace the engine air filter.',
    estimated_hours: 0.25,
    concern: 'Customer requests an engine air filter replacement.',
    priority: 'low',
    services: [
      service('Engine air filter replacement', 'Replace engine air filter element.', 0.25, 30),
    ],
  },
  {
    id: 'cabin-air-filter',
    name: 'Cabin Air Filter',
    description: 'Replace the cabin (pollen) filter.',
    estimated_hours: 0.25,
    concern: 'Customer requests a cabin air filter replacement.',
    priority: 'low',
    services: [
      service('Cabin air filter replacement', 'Replace cabin/pollen filter.', 0.25, 35),
    ],
  },
  {
    id: 'coolant-flush',
    name: 'Coolant Flush',
    description: 'Drain, flush and refill the cooling system.',
    estimated_hours: 1,
    concern: 'Customer requests a coolant flush.',
    priority: 'medium',
    services: [
      service(
        'Coolant flush',
        'Drain and flush cooling system, refill with coolant, bleed air, pressure test.',
        1,
        50,
      ),
    ],
  },
  {
    id: 'transmission-fluid',
    name: 'Transmission Fluid Service',
    description: 'Drain and refill transmission fluid.',
    estimated_hours: 1,
    concern: 'Customer requests a transmission fluid service.',
    priority: 'medium',
    services: [
      service(
        'Transmission fluid service',
        'Drain and refill transmission fluid, replace filter where fitted.',
        1,
        90,
      ),
    ],
  },
  {
    id: 'diagnostic-cel',
    name: 'Diagnostic — Check Engine Light',
    description: 'Scan codes and diagnose the check engine light.',
    estimated_hours: 1,
    concern: 'Customer reports the check engine light is on.',
    priority: 'high',
    services: [
      service(
        'Check engine light diagnostic',
        'Scan fault codes, review live data and pinpoint test the cause.',
        1,
        0,
      ),
    ],
  },
]

export function formatPresetHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`
  return `${hours} h`
}
