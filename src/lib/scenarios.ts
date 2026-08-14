import { Coffee, Train, ShoppingBag, Utensils, Building, Stethoscope, Briefcase, Phone, Plane, ShoppingCart, MapPin, GraduationCap } from 'lucide-react';

export const SCENARIOS = [
  { id: 'bakery', title: 'At the Bakery', icon: Coffee, difficulty: 'A1.1', desc: 'Order a coffee and a pastry at a German café.', color: 'from-amber-500 to-orange-500' },
  { id: 'train', title: 'Train Station', icon: Train, difficulty: 'A1.1', desc: 'Buy a ticket and find your platform.', color: 'from-blue-500 to-indigo-500' },
  { id: 'restaurant', title: 'Restaurant', icon: Utensils, difficulty: 'A1.2', desc: 'Order a meal and ask for the bill.', color: 'from-emerald-500 to-teal-500' },
  { id: 'supermarket', title: 'Supermarket', icon: ShoppingCart, difficulty: 'A1.2', desc: 'Find products and check out.', color: 'from-rose-500 to-pink-500' },
  { id: 'doctor', title: 'At the Doctor', icon: Stethoscope, difficulty: 'A1.1', desc: 'Describe symptoms and understand advice.', color: 'from-red-500 to-rose-500' },
  { id: 'buergeramt', title: 'Registration Office', icon: Building, difficulty: 'A1.2', desc: 'Register your address at the Bürgeramt.', color: 'from-slate-500 to-gray-500' },
  { id: 'apartment', title: 'Apartment Viewing', icon: Building, difficulty: 'A2.1', desc: 'Ask about rent, rooms, and facilities.', color: 'from-violet-500 to-purple-500' },
  { id: 'directions', title: 'Asking Directions', icon: MapPin, difficulty: 'A1.2', desc: 'Ask how to get to the post office.', color: 'from-cyan-500 to-blue-500' },
  { id: 'phone', title: 'Phone Call', icon: Phone, difficulty: 'A2.1', desc: 'Make an appointment by phone.', color: 'from-green-500 to-emerald-500' },
  { id: 'workplace', title: 'First Day at Work', icon: Briefcase, difficulty: 'A2.1', desc: 'Introduce yourself to colleagues.', color: 'from-orange-500 to-red-500' },
  { id: 'university', title: 'University Office', icon: GraduationCap, difficulty: 'A2.1', desc: 'Enroll in a course and ask questions.', color: 'from-indigo-500 to-violet-500' },
  { id: 'travel', title: 'Booking a Trip', icon: Plane, difficulty: 'A2.2', desc: 'Book a hotel and plan activities.', color: 'from-sky-500 to-cyan-500' },
  { id: 'shopping', title: 'Clothing Store', icon: ShoppingBag, difficulty: 'A1.2', desc: 'Try on clothes and ask about sizes.', color: 'from-pink-500 to-fuchsia-500' },
];
