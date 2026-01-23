import React, { useState } from 'react';
import { RechargePackage, RECHARGE_PACKAGES } from '../types';
import Button from './Button';
import { ArrowLeft, CheckCircle, Database, ShieldCheck } from 'lucide-react';

interface RechargeProps {
  onBack: () => void;
  onRechargeComplete: (credits: number) => void;
}

const Recharge: React.FC<RechargeProps> = ({ onBack, onRechargeComplete }) => {
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePackageSelect = (pkg: RechargePackage) => {
    setSelectedPackage(pkg);
    setIsPaying(true);
  };

  const simulatePayment = () => {
    setIsPaying(false);
    setIsSuccess(true);
    setTimeout(() => {
      if (selectedPackage) {
        onRechargeComplete(selectedPackage.credits);
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-green-100 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful</h2>
          <p className="text-gray-500 mb-8">
            Successfully recharged <span className="text-green-600 font-bold">{selectedPackage?.credits}</span> credits to your account.
          </p>
          <div className="text-sm text-gray-400 animate-pulse">Redirecting to profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Recharge Credits</h1>
          <p className="text-gray-500 text-lg">Choose a package to power your design workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RECHARGE_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative bg-white p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center ${
                selectedPackage?.id === pkg.id 
                  ? 'border-blue-500 shadow-xl shadow-blue-500/10' 
                  : 'border-white shadow-sm hover:border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 px-3 py-1 bg-blue-50 rounded-full">
                {pkg.label}
              </div>
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <Database size={24} />
                <span className="text-3xl font-black">{pkg.credits}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">Design Credits</p>
              
              <div className="text-4xl font-bold text-gray-900 mb-8">
                <span className="text-lg font-medium mr-1">¥</span>{pkg.price}
              </div>

              <Button 
                variant={selectedPackage?.id === pkg.id ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => handlePackageSelect(pkg)}
              >
                Purchase Now
              </Button>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {isPaying && selectedPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
              <div className="bg-blue-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <img src="https://img.icons8.com/color/48/alipay.png" alt="Alipay" className="w-8 h-8" />
                  <span className="font-bold text-xl">Alipay Secure Payment</span>
                </div>
                <button onClick={() => setIsPaying(false)} className="text-white/60 hover:text-white">
                  <ArrowLeft size={20} className="rotate-90" />
                </button>
              </div>

              <div className="p-10 flex flex-col items-center">
                <div className="text-center mb-8">
                  <p className="text-gray-500 text-sm mb-1">Payment Amount</p>
                  <h3 className="text-4xl font-bold text-gray-900">¥ {selectedPackage.price}.00</h3>
                </div>

                <div className="relative p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-inner mb-8">
                  {/* Simulated QR Code */}
                  <div className="w-48 h-48 bg-gray-50 flex items-center justify-center border-4 border-white overflow-hidden rounded-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=alipay-recharge-${selectedPackage.id}`} 
                      alt="Payment QR"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <img src="https://img.icons8.com/color/144/alipay.png" alt="Alipay Watermark" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-8 bg-green-50 px-4 py-2 rounded-full">
                  <ShieldCheck size={18} />
                  Scan with your mobile app to pay
                </div>

                <Button className="w-full py-4 bg-[#00A0E9] hover:bg-[#0088CC] border-none" onClick={simulatePayment}>
                  Confirm Payment (Demo)
                </Button>
                <p className="mt-4 text-xs text-gray-400">Transaction secured by 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recharge;
