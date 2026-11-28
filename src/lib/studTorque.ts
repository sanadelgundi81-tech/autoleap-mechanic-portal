/**
 * Stud-size fallback: lug-nut torque RANGES by stud thread, from the free
 * public chart at calibr.pro (verified by calibr.pro on 2026-10-12; read
 * 2026-11-27). These are wheel/stud makers' ranges, NOT a vehicle's spec:
 * they are never stored in torque_specs and are only shown when the shop has
 * no per-vehicle row. Values are copied exactly as the chart states both
 * columns (calibr.pro prints ft·lb and gives N·m converted from it).
 */
export const STUD_TORQUE_SOURCE = 'https://calibr.pro/tables/wheel-torque-chart/'

export interface StudTorqueRange {
  thread: string
  nmFrom: number
  nmTo: number
  ftlbFrom: number
  ftlbTo: number
  vehicle: string
  mounting: string
}

export const STUD_TORQUE_RANGES: StudTorqueRange[] = [
  { thread: '7/16"-20', nmFrom: 75, nmTo: 115, ftlbFrom: 55, ftlbTo: 85, vehicle: 'Car, SUV', mounting: 'Aftermarket wheel; nut seat to match' },
  { thread: 'M12', nmFrom: 95, nmTo: 122, ftlbFrom: 70, ftlbTo: 90, vehicle: 'Car, SUV', mounting: 'Aftermarket wheel; nut seat to match' },
  { thread: '1/2"-20', nmFrom: 102, nmTo: 129, ftlbFrom: 75, ftlbTo: 95, vehicle: 'Car, SUV', mounting: 'Aftermarket wheel; nut seat to match' },
  { thread: 'M14', nmFrom: 115, nmTo: 149, ftlbFrom: 85, ftlbTo: 110, vehicle: 'Car, SUV', mounting: 'Aftermarket wheel; nut seat to match' },
  { thread: '5/8"-18', nmFrom: 176, nmTo: 197, ftlbFrom: 130, ftlbTo: 145, vehicle: 'Car, SUV', mounting: 'Aftermarket wheel; nut seat to match' },
  { thread: 'M22×1.5', nmFrom: 610, nmTo: 678, ftlbFrom: 450, ftlbTo: 500, vehicle: 'Truck, bus, trailer', mounting: 'Hub-piloted; two-piece flange nut' },
  { thread: '3/4"-16', nmFrom: 610, nmTo: 678, ftlbFrom: 450, ftlbTo: 500, vehicle: 'Truck, bus, trailer', mounting: 'Stud-piloted; inner ball-seat cap nut (duals)' },
  { thread: '1-1/8"-16', nmFrom: 610, nmTo: 678, ftlbFrom: 450, ftlbTo: 500, vehicle: 'Truck, bus, trailer', mounting: 'Stud-piloted; outer ball-seat cap nut' },
]

/** What the chart says it does not cover (fewer than two makers), shown so nobody stretches a row. */
export const STUD_TORQUE_NOT_COVERED = '9/16"-18, M14×2.0, M18×1.5, M20×1.5'
