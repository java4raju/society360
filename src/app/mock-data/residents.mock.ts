import { Resident } from '../shared/models/models';

const owners = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Gupta',
  'Suresh Nair', 'Meera Iyer', 'Karthik Rao', 'Divya Menon', 'Arjun Desai', 'Pooja Joshi', 'Ravi Verma',
  'Kavya Pillai', 'Manish Agarwal', 'Neha Kapoor', 'Sandeep Yadav', 'Ritu Malhotra', 'Deepak Choudhary', 'Swati Bhat'];
const tenants = ['Rahul Mehta', 'Sunita Das', 'Vivek Saxena', 'Lakshmi Krishnan', 'Aakash Jain', null, null, 'Tara Bose'];
const blocks = ['A', 'B', 'C', 'D'];

export const RESIDENTS: Resident[] = Array.from({ length: 50 }, (_, i) => {
  const block = blocks[i % 4];
  const floor = Math.floor(i / 4) + 1;
  const unit = (i % 4) + 1;
  const occ: Resident['occupancy'] = i % 7 === 0 ? 'Vacant' : i % 3 === 0 ? 'Tenant' : 'Owner';
  const tenant = occ === 'Tenant' ? (tenants[i % tenants.length] ?? 'Resident Tenant') : null;
  const dues = i % 5 === 0 ? 2500 * ((i % 3) + 1) : 0;
  return {
    id: `R${(i + 1).toString().padStart(3, '0')}`,
    flatNumber: `${block}-${floor}0${unit}`,
    block,
    ownerName: owners[i % owners.length],
    tenantName: tenant,
    contact: `+91 ${90000 + i * 137 % 9999}${10000 + i * 271 % 89999}`.slice(0, 14),
    email: `${owners[i % owners.length].split(' ')[0].toLowerCase()}${i}@society360.in`,
    parkingSlots: (i % 3),
    occupancy: occ,
    status: occ === 'Vacant' ? 'Inactive' : 'Active',
    duesAmount: dues,
    joinedDate: `20${18 + (i % 6)}-0${(i % 9) + 1}-1${i % 9}`
  };
});
