import { MessageCircle } from 'lucide-react';

const FloatingActionButton = () => {
  return (
    <button
      className="md:hidden fixed bottom-20 right-6 z-40 bg-[#EF5350] hover:bg-[#D32F2F] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
      onClick={() => {
        console.log('FAB clicked');
      }}
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default FloatingActionButton;
