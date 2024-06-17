import { Phone, MapPin, Mail } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="flex flex-col max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <h3 className="text-xl mb-8">Mega African Market</h3>
      <div className="flex flex-col md:flex-row md:justify-around gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex justify-center">
            <Phone className="text-red-600" />
          </div>
          <h3 className="mt-2">
            <div>Call us</div> 1 (443) 776 1887
          </h3>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex justify-center">
            <MapPin className="text-red-600" />
          </div>
          <h3 className="mt-2">
            <div>Location:</div>7214 B Windsor Mill Rd, Baltimore, Maryland
            21244
          </h3>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex justify-center">
            <Mail className="text-red-600" />
          </div>
          <h3 className="mt-2">
            <div>Email</div>info@megaafricanmarket.com
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
