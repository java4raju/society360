import { Project, ProjectStatus } from '../shared/models/models';

const data: Array<[string, string, number, ProjectStatus, string]> = [
  ['Lift Upgrade', 'Modernize all 4 elevators with new control systems', 1800000, 'In Progress', 'Infrastructure'],
  ['CCTV Upgrade', 'Install 64 HD cameras with NVR and 30-day storage', 950000, 'In Progress', 'Security'],
  ['Garden Renovation', 'Landscape redesign with native plants and irrigation', 620000, 'Approved', 'Amenities'],
  ['Solar Installation', '100kW rooftop solar to cut common-area power bills', 4200000, 'Proposed', 'Sustainability'],
  ['Clubhouse Renovation', 'Refurbish clubhouse interiors and add co-working zone', 2300000, 'Approved', 'Amenities'],
  ['Rainwater Harvesting', 'Recharge pits and storage for monsoon water', 780000, 'Completed', 'Sustainability'],
  ['Gym Equipment', 'New cardio and strength equipment for fitness center', 540000, 'Completed', 'Amenities'],
  ['Parking Automation', 'Boom barriers with RFID and visitor management', 1100000, 'In Progress', 'Security'],
  ['Facade Painting', 'Exterior repainting of all 4 blocks', 1650000, 'Proposed', 'Infrastructure'],
  ['Water Treatment Plant', 'Upgrade STP and add water softener', 2900000, 'Approved', 'Infrastructure'],
  ['EV Charging Stations', '12 EV charging points in basement parking', 880000, 'Proposed', 'Sustainability'],
  ['Childrens Play Area', 'Safe modern play equipment with rubber flooring', 460000, 'Completed', 'Amenities'],
  ['Fire Safety Upgrade', 'New hydrants, alarms and sprinkler servicing', 1350000, 'In Progress', 'Security'],
  ['Smart Access Control', 'Biometric and app-based entry for towers', 720000, 'Proposed', 'Security'],
  ['Swimming Pool Revamp', 'Re-tiling, filtration and deck upgrade', 1950000, 'Approved', 'Amenities']
];

const owners = ['Maintenance Committee', 'Security Committee', 'Finance Committee', 'Cultural Committee'];

export const PROJECTS: Project[] = data.map(([name, desc, budget, status, cat], i) => {
  const progress = status === 'Completed' ? 100 : status === 'In Progress' ? 30 + (i * 13 % 60)
    : status === 'Approved' ? 5 + (i % 10) : 0;
  return {
    id: `PRJ${(300 + i)}`,
    name, description: desc, budget,
    spent: Math.round(budget * progress / 100),
    progress, status,
    startDate: `2026-0${(i % 6) + 1}-01`,
    endDate: `2026-${(8 + i % 4).toString().padStart(2, '0')}-28`,
    owner: owners[i % owners.length],
    category: cat
  };
});
