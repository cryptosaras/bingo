import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { generateTicketPDF, calculatePageCount } from '../../services/pdfService';
import { translations as t } from '../../utils/translations';

interface Props {
  onClose: () => void;
}

export function PDFGenerator({ onClose }: Props) {
  const [quantity, setQuantity] = useState(20);
  const { getRandomTickets } = useGameStore();

  const pageCount = calculatePageCount(quantity);

  const handleGenerate = () => {
    const tickets = getRandomTickets(quantity);
    generateTicketPDF(tickets);
  };

  return (
    <div className="fixed inset-0 memphis-modal-overlay flex items-center justify-center z-50">
      <div className="memphis-card p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-black">{t.exportTicketsPDF}</h2>
          <button
            onClick={onClose}
            className="memphis-btn w-10 h-10 bg-[#FF6B6B] text-white text-2xl leading-none flex items-center justify-center hover:bg-[#EF5B5B]"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              {t.numberOfTickets}
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
              className="memphis-input w-full text-lg text-black"
            />
          </div>

          {/* Quick Select Buttons */}
          <div className="flex gap-2">
            {[10, 20, 50, 100].map(num => (
              <button
                key={num}
                onClick={() => setQuantity(num)}
                className={`
                  memphis-btn flex-1 px-3 py-2 text-sm
                  ${quantity === num
                    ? 'bg-[#3D8BFF] text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="text-sm font-bold bg-[#FFD93D] rounded-lg p-4 border-3 border-black shadow-[3px_3px_0px_#000]">
            <div className="flex justify-between py-1">
              <span className="text-black/70">{t.tickets}:</span>
              <span className="text-black">{quantity}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-black/70">{t.pagesCount}:</span>
              <span className="text-black">{pageCount}</span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="memphis-btn w-full px-4 py-4 bg-[#5AE35A] text-black text-lg hover:bg-[#4CD34C]"
          >
            {t.downloadPDF}
          </button>
        </div>
      </div>
    </div>
  );
}
