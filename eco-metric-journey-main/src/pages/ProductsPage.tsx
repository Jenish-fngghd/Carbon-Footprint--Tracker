import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { Leaf, ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  discount: number;
  ecoPointsCost: number;
  image: string;
  description?: string;
  url: string;
}

const products: Product[] = [
  {
    id: "prod1",
    name: "Eco Mug",
    discount: 5,
    ecoPointsCost: 250,
    image: "2.jpg",
    description: "Sustainable ceramic mug",
    url: "https://www.amazon.in/Chhaap-Glossy-Finish-Microwave-Ceramic/dp/B09GKKDSFB/ref=sr_1_6?crid=3K9GQH3ZN16BM&dib=eyJ2IjoiMSJ9.lwfKxq_VP_Tzebejw6YNytilV2wvORRIUs593SFpgfdL0BWiZtUBNx4x-7DxwBsuhGAziYqoYkNY3ajHdHfVL9BLcp7P38cBXCL1uNDK2VJnfPve3t1rGKlWKLFB5YQrpCa4LmJ0xyBPwljIYnzyBJVk4SgpZHZ2yNZqMsyT_niQF1OjLHpvC00qGHy13dha13sJPd3N-8azh_eeF597b5VXKK69EU3xSztOE8Quw5vB0irzCBW9wcvNPLFlqz_Jhh2kFAkyK0TWt8D-G2PWW_EAULcppFFU_SxnlAJvjCsuGPyiPlceMeY_QqyoanBJuUxDII5M3cO1LZ9Uk6Vbn6Z8FbxhAVlDvhYN9ZLfdqL4hMWHo-dX0Cg1Yso4NGfLcV72JqOUYEKpkZAbdWPXz8gHU03ijOBNL2iLesE4ZISCYS5ivaa7Pb08PZT40SfK.8GmeHXDgxIDpXDy9QPykySPJ82LO2iIDGusAiJxaQlE&dib_tag=se&keywords=white+mug&qid=1742670839&sprefix=white+mug%2Caps%2C219&sr=8-6",
  },
  {
    id: "prod2",
    name: "Green T-Shirt",
    discount: 10,
    ecoPointsCost: 500,
    image: "3.jpg",
    description: "Organic cotton tee",
    url: "https://www.amazon.in/WALLABY-KIDS-Planet-Science-T-Shirt/dp/B0BZQ1WGGS/ref=sr_1_3?crid=3KJQIPFECXBRX&dib=eyJ2IjoiMSJ9.EHmEKguH38_lfFQmbMsH_0sazwqwcFZiIGAyNZgddVkXA0JsyXiQ_dcOfY5DIIsoXPZKZMGgoBLu9Qz8c_lbctLINx_hfRi4m5c4-znzEa3WLA5ic1tTMVS28fo7RUfuE9JZ29SEmmCd4-en7GWgursolXyL_XG0qYx-fMXOMlXZ1X4cNdtne2pPqLYRfZbY93KvukQvSjpa0eg8qTgM39SiN7XYYuwnjpE6nlSHKpPJYhfGNdIJ0eY5UNS9xpjHjnh0eljIJjhWwKua5_KtnZyQiTp48e_OAUDFzX-o-Ht0Pxg5nGgj0XK3W6GrF7eeBiGXtYMF3OFKJqdec2z_nAda1FZwqDSFT705JKQsKYSizAw3C-zKsgzPhv70Qwfxx4lH-heh2Nz8yN2poW59I2rArlIwPjfAHpPSm0xV6F2PuDA_8A5QX-kziabYiWf7.tnfEEw8R0vqaYtILgyKveK1JvgRDkjpvhGT8iK7RvxI&dib_tag=se&keywords=environment%2Bgreen%2Bt-%2Bshirt&qid=1742671024&s=luggage&sprefix=environmentgreen%2Bt-%2Bshirt%2Cluggage%2C231&sr=1-3&th=1&psc=1",
  },
  {
    id: "prod3",
    name: "Reusable Bag",
    discount: 15,
    ecoPointsCost: 750,
    image: "1.jpg",
    description: "Eco-friendly tote",
    url: "https://www.amazon.in/MAKMOR-Cotton-Extra-Strong-Handles/dp/B0DHD8WPKK/ref=sr_1_16?dib=eyJ2IjoiMSJ9.DPS4uUPAatq4Ugd5YfGk0TgkJvdvPNHwz62sf7GHQDZ_ZNPIkSXoANgT34JtiW2mMeZvhrv3FqcM8Rq42cg7QYugjneLKHGAcBOFbWhxsOAP4L2zS2QBlHAJcHtjdYKL3PdTNx2OAEO3H_kI4JriGZGmuZoKdNKEGNFHmU327TjNufECQksoNsHrx8_WIARxsg1YSAR5J6KGcZH-b_0wLylIgEH_LMnREdXI62FZY0GS8f8iMKk-Ltf1xeIwH-n0FuuPtb4eRqdRjCuZc5t4CYBRdb7PJRD22T991dW5aqQQES-9Fq51txuGAIKOS-NWiPgoHNF5bKKoVG-SjrCUZIMIbRRarJQhe_JDiGgXzzm6SMatfrgnsQmYStY_VKHA7t9QcwPBpOTe-jEbf-uGyIha2u6VXrab1q8B7mnpjdlNKMRntPlYjJJ9ruromuiH.M9Wek4AP8d2lBjoeBbypya7VX42WTznGgVNI7Rkay54&dib_tag=se&keywords=white%2Bjute%2Bbag&qid=1742670914&s=luggage&sr=1-16&th=1",
  },
];

const ProductsPage: React.FC = () => {
  const { user, updateEcoPoints, addCoupon } = useAuth();
  const { toast } = useToast();

  const handleRedeem = async (product: Product) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to redeem products.",
        variant: "destructive",
      });
      return;
    }

    if (user.ecoPoints < product.ecoPointsCost) {
      toast({
        title: "Insufficient Eco Points",
        description: `You need ${product.ecoPointsCost} eco points to redeem this discount.`,
        variant: "destructive",
      });
      return;
    }

    const couponCode = `ECO${product.id.toUpperCase()}${Date.now().toString().slice(-4)}`;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const expirationDateString = expirationDate.toISOString().split("T")[0];

    try {
      // Optimistically update local state
      const newEcoPoints = user.ecoPoints - product.ecoPointsCost;
      updateEcoPoints(-product.ecoPointsCost); // Deduct points (async call to backend)

      // Add coupon after points are deducted
      await addCoupon({
        code: couponCode,
        productName: product.name,
        discount: product.discount,
        expirationDate: expirationDateString,
      });

      toast({
        title: "Discount Redeemed",
        description: `You've redeemed a ${product.discount}% discount for ${product.name}! Coupon code: ${couponCode}. Expires on ${expirationDateString}. Check your profile for details.`,
      });
    } catch (error) {
      // Roll back local change if backend fails
      toast({
        title: "Error",
        description: "Failed to redeem coupon. Please try again.",
        variant: "destructive",
      });
      // Optionally revert ecoPoints locally if needed
      updateEcoPoints(product.ecoPointsCost); // Undo deduction on error
    }
  };

  if (!user) {
    return <div className="text-white text-center py-10">Please sign in to view products</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Eco Products</h1>
          <p className="mt-3 text-lg text-gray-300">Redeem your eco points for sustainable rewards</p>
          <p className="mt-2 text-xl text-eco-light font-medium">
            Eco Points: <span className="text-ecoDEFAULT">{user.ecoPoints}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#1e293b] rounded-xl shadow-2xl p-6 border border-[#334155] flex flex-col justify-between transform transition-all hover:scale-105 hover:border-eco-light/50"
            >
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full object-contain rounded-lg border border-[#334155]"
                  />
                  <span className="absolute top-2 right-2 bg-eco-dark text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
                  <p className="text-sm text-gray-400 italic">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-md text-gray-300">
                      Cost: <span className="text-eco-light font-medium text-lg">{product.ecoPointsCost} Points</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => handleRedeem(product)}
                  className="w-full bg-eco-dark hover:bg-eco-DEFAULT text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
                  disabled={user.ecoPoints < product.ecoPointsCost}
                >
                  <Leaf className="h-5 w-5 mr-2" /> Redeem
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-eco-light text-eco-light hover:bg-eco-light/10 font-semibold py-3 px-6 rounded-lg flex items-center justify-center"
                  onClick={() => window.open(product.url, "_blank")}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" /> Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;