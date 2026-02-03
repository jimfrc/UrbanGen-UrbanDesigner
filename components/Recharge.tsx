import React, { useState, useEffect } from 'react';
import { RechargePackage, RECHARGE_PACKAGES, User } from '../types';
import Button from './Button';
import { ArrowLeft, CheckCircle, Database, ShieldCheck, AlertCircle } from 'lucide-react';
import { createPayment, queryPayment } from '../services/localStorageService';

interface RechargeProps {
  user: User;
  onBack: () => void;
  onRechargeComplete: (credits: number) => void;
}

const Recharge: React.FC<RechargeProps> = ({ user, onBack, onRechargeComplete }) => {
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handlePackageSelect = async (pkg: RechargePackage) => {
    setSelectedPackage(pkg);
    setIsPaying(true);
    setError(null);

    const result = await createPayment(user.id, pkg.id, pkg.price, `充值${pkg.credits}积分`);

    if (result.success && result.qrCode) {
      setQrCode(result.qrCode);
      setOrderId(result.orderId);
    } else {
      setError(result.error || '创建支付订单失败');
      setIsPaying(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    const result = await queryPayment(orderId);
    
    if (result.success && result.order?.status === 'success') {
      setIsSuccess(true);
      setQrCode(null);
      setTimeout(() => {
        if (selectedPackage) {
          onRechargeComplete(selectedPackage.credits);
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (orderId) {
      const interval = setInterval(checkPaymentStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

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
                isLoading={isPaying && selectedPackage?.id === pkg.id}
              >
                Purchase Now
              </Button>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {qrCode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
              <div className="bg-blue-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <img src="https://img.icons8.com/color/48/alipay.png" alt="Alipay" className="w-8 h-8" />
                  <span className="font-bold text-xl">Alipay Secure Payment</span>
                </div>
                <button onClick={() => setQrCode(null)} className="text-white/60 hover:text-white">
                  <ArrowLeft size={20} className="rotate-90" />
                </button>
              </div>

              <div className="p-10">
                <div className="text-center mb-8">
                  <p className="text-gray-500 text-sm mb-1">Payment Amount</p>
                  <h3 className="text-4xl font-bold text-gray-900">¥ {selectedPackage?.price}.00</h3>
                  <p className="text-sm text-gray-400 mt-2">Order ID: {orderId}</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl text-center mb-8">
                  <p className="text-sm text-gray-600 mb-4">Scan QR code with Alipay app to pay</p>
                  <div className="w-48 h-48 mx-auto bg-white rounded-xl p-2">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                      alt="Payment QR Code"
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-green-600 text-sm font font-medium mb-8 bg-green-50 px-4 py-2 rounded-full">
                  <ShieldCheck size={18} />
                  Waiting for payment confirmation...
                </div>

                <div className="text-center space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setQrCode(null)}
                  >
                    Cancel Payment
                  </Button>
                </div>
                <p className="mt-4 text-xs text-gray-400 text-center">Transaction secured by 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recharge;
