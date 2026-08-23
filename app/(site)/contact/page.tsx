import { RouteStub } from '@/components/sections/RouteStub';

export default function ContactPage() {
  return (
    <RouteStub
      index="07"
      title={['CONTACT']}
      milestone="Milestone 2 / 3"
      owner="Developer 2 (layout) · Developer 1 (booking form)"
      scope="Contact layout and details block are Developer 2's Milestone 2 task. The booking/inquiry form, its Firestore write and the Nodemailer notification are Developer 1's Milestone 3 task — no form is built in Milestone 1 by design."
    />
  );
}
