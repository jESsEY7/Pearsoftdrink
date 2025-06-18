import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-green-900 dark:bg-green-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold">Paya</span>
            </div>
            <p className="text-green-100 mb-4 max-w-md">
              Premium energy and soft drinks for the youth community. 
              Choose Paya for the energy to achieve your dreams, free from distractions.
            </p>
            <p className="text-green-200 font-semibold">
              GINI WASEKAO: PAYA! 🎉
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-green-100">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#energy" className="hover:text-white transition-colors">Energy Drinks</a></li>
              <li><a href="#soft" className="hover:text-white transition-colors">Soft Drinks</a></li>
              <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-green-100">
              <li>Email: info@paya.co.ke</li>
              <li>Phone: +254 700 000 000</li>
              <li>Address: Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-100">
          <p className="flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-400" /> for the Paya Youth Community
          </p>
          <p className="mt-2">© 2025 Paya Premium Beverages. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
