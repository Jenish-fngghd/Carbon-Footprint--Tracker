import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, User, Device } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Gift, HardDrive, Settings, Edit2, Trash2, Users, Award, MessageSquare, Tag, Calendar, ShoppingBag } from "lucide-react";

const productUrls: { [key: string]: string } = {
  "Eco Mug": "https://www.amazon.in/Chhaap-Glossy-Finish-Microwave-Ceramic/dp/B09GKKDSFB/ref=sr_1_6?crid=3K9GQH3ZN16BM&dib=eyJ2IjoiMSJ9.lwfKxq_VP_Tzebejw6YNytilV2wvORRIUs593SFpgfdL0BWiZtUBNx4x-7DxwBsuhGAziYqoYkNY3ajHdHfVL9BLcp7P38cBXCL1uNDK2VJnfPve3t1rGKlWKLFB5YQrpCa4LmJ0xyBPwljIYnzyBJVk4SgpZHZ2yNZqMsyT_niQF1OjLHpvC00qGHy13dha13sJPd3N-8azh_eeF597b5VXKK69EU3xSztOE8Quw5vB0irzCBW9wcvNPLFlqz_Jhh2kFAkyK0TWt8D-G2PWW_EAULcppFFU_SxnlAJvjCsuGPyiPlceMeY_QqyoanBJuUxDII5M3cO1LZ9Uk6Vbn6Z8FbxhAVlDvhYN9ZLfdqL4hMWHo-dX0Cg1Yso4NGfLcV72JqOUYEKpkZAbdWPXz8gHU03ijOBNL2iLesE4ZISCYS5ivaa7Pb08PZT40SfK.8GmeHXDgxIDpXDy9QPykySPJ82LO2iIDGusAiJxaQlE&dib_tag=se&keywords=white+mug&qid=1742670839&sprefix=white+mug%2Caps%2C219&sr=8-6",
  "Green T-Shirt": "https://www.amazon.in/WALLABY-KIDS-Planet-Science-T-Shirt/dp/B0BZQ1WGGS/ref=sr_1_3?crid=3KJQIPFECXBRX&dib=eyJ2IjoiMSJ9.EHmEKguH38_lfFQmbMsH_0sazwqwcFZiIGAyNZgddVkXA0JsyXiQ_dcOfY5DIIsoXPZKZMGgoBLu9Qz8c_lbctLINx_hfRi4m5c4-znzEa3WLA5ic1tTMVS28fo7RUfuE9JZ29SEmmCd4-en7GWgursolXyL_XG0qYx-fMXOMlXZ1X4cNdtne2pPqLYRfZbY93KvukQvSjpa0eg8qTgM39SiN7XYYuwnjpE6nlSHKpPJYhfGNdIJ0eY5UNS9xpjHjnh0eljIJjhWwKua5_KtnZyQiTp48e_OAUDFzX-o-Ht0Pxg5nGgj0XK3W6GrF7eeBiGXtYMF3OFKJqdec2z_nAda1FZwqDSFT705JKQsKYSizAw3C-zKsgzPhv70Qwfxx4lH-heh2Nz8yN2poW59I2rArlIwPjfAHpPSm0xV6F2PuDA_8A5QX-kziabYiWf7.tnfEEw8R0vqaYtILgyKveK1JvgRDkjpvhGT8iK7RvxI&dib_tag=se&keywords=environment%2Bgreen%2Bt-%2Bshirt&qid=1742671024&s=luggage&sprefix=environmentgreen%2Bt-%2Bshirt%2Cluggage%2C231&sr=1-3&th=1&psc=1",
  "Reusable Bag": "https://www.amazon.in/MAKMOR-Cotton-Extra-Strong-Handles/dp/B0DHD8WPKK/ref=sr_1_16?dib=eyJ2IjoiMSJ9.DPS4uUPAatq4Ugd5YfGk0TgkJvdvPNHwz62sf7GHQDZ_ZNPIkSXoANgT34JtiW2mMeZvhrv3FqcM8Rq42cg7QYugjneLKHGAcBOFbWhxsOAP4L2zS2QBlHAJcHtjdYKL3PdTNx2OAEO3H_kI4JriGZGmuZoKdNKEGNFHmU327TjNufECQksoNsHrx8_WIARxsg1YSAR5J6KGcZH-b_0wLylIgEH_LMnREdXI62FZY0GS8f8iMKk-Ltf1xeIwH-n0FuuPtb4eRqdRjCuZc5t4CYBRdb7PJRD22T991dW5aqQQES-9Fq51txuGAIKOS-NWiPgoHNF5bKKoVG-SjrCUZIMIbRRarJQhe_JDiGgXzzm6SMatfrgnsQmYStY_VKHA7t9QcwPBpOTe-jEbf-uGyIha2u6VXrab1q8B7mnpjdlNKMRntPlYjJJ9ruromuiH.M9Wek4AP8d2lBjoeBbypya7VX42WTznGgVNI7Rkay54&dib_tag=se&keywords=white%2Bjute%2Bbag&qid=1742670914&s=luggage&sr=1-16&th=1",
};

export const ProfilePage: React.FC = () => {
  const { user, updateDevices } = useAuth();
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>(user?.devices ?? []);
  const [editingDevice, setEditingDevice] = useState<number | null>(null);
  const [newDeviceName, setNewDeviceName] = useState<string>("");
  const [activeSection, setActiveSection] = useState<"personal" | "devices" | "coupons" | "settings" | "events" | "challenges" | "comments">("personal");

  const userEvents = [
    { id: 1, title: "Virtual Sustainability Workshop", date: "May 15, 2023", type: "Online" },
    { id: 2, title: "Community Clean-up Day", date: "May 22, 2023", type: "In-person" },
  ];

  const userChallenges = [
    { id: 1, title: "30-Day Energy Reduction", co2Saved: 500, participants: 6 },
  ];

  const userComments = [
    { id: 1, post: "Just reduced my carbon footprint by 15% this month!", content: "Great job! I’m trying to do the same.", time: "1 hour ago" },
    { id: 2, post: "Switch to renewable energy sources where possible.", content: "I switched to solar last month, it’s amazing!", time: "2 days ago" },
  ];

  const handleAddDevice = async () => {
    const newDevice = { id: `device-${Date.now()}`, name: `New Device ${devices.length + 1}` };
    const updatedDevices = [...devices, newDevice];
    setDevices(updatedDevices);
    try {
      await updateDevices(updatedDevices);
      toast({ title: "Device Added", description: "New device has been added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add device", variant: "destructive" });
    }
  };

  const handleDeleteDevice = async (index: number) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);
    try {
      await updateDevices(updatedDevices);
      toast({ title: "Device Deleted", description: "Device has been removed successfully", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete device", variant: "destructive" });
    }
  };

  const handleRenameDevice = async (index: number) => {
    if (newDeviceName.trim() === "") {
      toast({ title: "Error", description: "Device name cannot be empty", variant: "destructive" });
      return;
    }
    const updatedDevices = [...devices];
    updatedDevices[index].name = newDeviceName;
    setDevices(updatedDevices);
    setEditingDevice(null);
    setNewDeviceName("");
    try {
      await updateDevices(updatedDevices);
      toast({ title: "Device Renamed", description: "Device name updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to rename device", variant: "destructive" });
    }
  };

  const isCouponExpired = (expirationDate: string) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    return today > expiry;
  };

  if (!user) {
    return <div className="text-white text-center py-10">Please sign in to view your profile</div>;
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/3 bg-[#1e293b] rounded-xl p-8 shadow-lg border border-[#334155] animate-fade-in min-h-[800px]">
          <div className="flex items-center space-x-6 mb-10">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center text-3xl font-bold text-white border-2 border-[#334155]">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.firstName} {user.lastName}</h2>
              <p className="text-md text-gray-400">{user.email}</p>
              <p className="text-md text-eco-light mt-2">Eco Points: <span className="font-medium">{user.ecoPoints}</span></p>
            </div>
          </div>
          <nav className="space-y-3">
            {[
              { name: "Personal Info", icon: UserIcon, section: "personal" },
              { name: "Devices", icon: HardDrive, section: "devices" },
              { name: "Coupons", icon: Gift, section: "coupons" },
              { name: "Events Joined", icon: Users, section: "events" },
              { name: "Challenges", icon: Award, section: "challenges" },
              { name: "Comments", icon: MessageSquare, section: "comments" },
              { name: "Settings", icon: Settings, section: "settings" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.section as "personal" | "devices" | "coupons" | "settings" | "events" | "challenges" | "comments")}
                className={`w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all ${
                  activeSection === item.section
                    ? "bg-[#334155] text-[#3b82f6]"
                    : "text-gray-300 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-md font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:w-2/3 bg-[#1e293b] rounded-xl p-10 shadow-lg border border-[#334155] animate-slide-up min-h-[800px]">
          <h1 className="text-4xl font-extrabold text-white mb-8">
            {activeSection === "personal" && "Personal Information"}
            {activeSection === "devices" && "Your Devices"}
            {activeSection === "coupons" && "Your Coupons"}
            {activeSection === "events" && "Events Joined"}
            {activeSection === "challenges" && "Challenges Participated"}
            {activeSection === "comments" && "Your Comments"}
            {activeSection === "settings" && "Account Settings"}
          </h1>

          {activeSection === "personal" && (
            <div className="space-y-6">
              <div className="border-b border-[#334155] pb-5">
                <p className="text-md text-gray-400">First Name</p>
                <p className="text-xl text-white">{user.firstName}</p>
              </div>
              <div className="border-b border-[#334155] pb-5">
                <p className="text-md text-gray-400">Last Name</p>
                <p className="text-xl text-white">{user.lastName}</p>
              </div>
              <div className="border-b border-[#334155] pb-5">
                <p className="text-md text-gray-400">Email</p>
                <p className="text-xl text-white">{user.email}</p>
              </div>
              <div className="border-b border-[#334155] pb-5">
                <p className="text-md text-gray-400">Joined</p>
                <p className="text-xl text-white">{user.joinedDate}</p>
              </div>
            </div>
          )}

          {activeSection === "devices" && (
            <div className="space-y-8">
              {devices.length === 0 ? (
                <p className="text-md text-gray-400">No devices added yet.</p>
              ) : (
                devices.map((device, index) => (
                  <div
                    key={index}
                    className="border-b border-[#334155] pb-5 flex justify-between items-center"
                  >
                    {editingDevice === index ? (
                      <div className="flex items-center gap-4 w-full">
                        <Input
                          value={newDeviceName}
                          onChange={(e) => setNewDeviceName(e.target.value)}
                          placeholder={device.name}
                          className="bg-[#0f172a] border-[#334155] text-white text-md flex-1 py-6"
                        />
                        <Button
                          onClick={() => handleRenameDevice(index)}
                          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingDevice(null)}
                          variant="outline"
                          className="bg-[#0f172a] border-[#334155] text-white hover:bg-[#334155] font-semibold py-3 px-6 rounded-lg"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-xl text-white font-medium">{device.name}</p>
                          <p className="text-sm text-gray-400">ID: {device.id}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => {
                              setEditingDevice(index);
                              setNewDeviceName(device.name);
                            }}
                            className="text-gray-300 hover:text-white hover:bg-[#334155]"
                          >
                            <Edit2 className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => handleDeleteDevice(index)}
                            className="text-red-500 hover:text-red-400 hover:bg-[#334155]"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
              <Button
                onClick={handleAddDevice}
                className="mt-6 bg-eco-dark hover:bg-eco-DEFAULT text-white font-semibold py-3 px-6 rounded-lg"
              >
                + Add Device
              </Button>
            </div>
          )}

          {activeSection === "coupons" && (
            <div className="space-y-6">
              {user.coupons.length === 0 ? (
                <p className="text-md text-gray-400">No coupons redeemed yet.</p>
              ) : (
                user.coupons.map((coupon, index) => {
                  const expired = isCouponExpired(coupon.expirationDate);
                  const productUrl = productUrls[coupon.productName] || "#"; // Fallback to "#" if no URL
                  return (
                    <div
                      key={index}
                      className={`bg-[#0f172a] rounded-lg p-5 shadow-md border border-[#334155] flex flex-col gap-3 transition-all ${
                        expired ? "opacity-60 border-red-500/50" : "hover:border-eco-light/50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl text-white font-semibold">{coupon.productName}</h3>
                        {expired && (
                          <span className="bg-red-500/20 text-red-300 text-xs font-semibold px-2 py-1 rounded-full">
                            Expired
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-eco-light" />
                          <p className="text-md text-gray-300">
                            Discount: <span className="text-eco-light font-medium">{coupon.discount}% OFF</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-md text-gray-300">Code:</span>
                          <p className="text-md text-eco-light font-mono">{coupon.code}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className={`text-md ${expired ? "text-red-400" : "text-gray-400"}`}>
                            Expires: {coupon.expirationDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigator.clipboard.writeText(coupon.code).then(() =>
                              toast({ title: "Copied", description: "Coupon code copied to clipboard!" })
                            )
                          }
                          className="text-gray-300 hover:text-white hover:bg-[#334155]"
                          disabled={expired}
                        >
                          Copy Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-eco-light text-eco-light hover:bg-eco-light/10"
                          onClick={() => window.open(productUrl, "_blank")}
                          disabled={expired}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" /> Shop Now
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeSection === "events" && (
            <div className="space-y-8">
              {userEvents.length === 0 ? (
                <p className="text-md text-gray-400">You haven’t joined any events yet.</p>
              ) : (
                userEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border-b border-[#334155] pb-5 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xl text-white font-medium">{event.title}</p>
                      <p className="text-sm text-gray-400">Date: {event.date}</p>
                      <p className="text-sm text-gray-400">Type: {event.type}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-[#0f172a] border-[#334155] text-eco-light hover:bg-[#334155] font-semibold py-2 px-4 rounded-lg"
                      onClick={() => toast({ title: "Feature Coming Soon", description: "View event details in profile is under development" })}
                    >
                      View Details
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === "challenges" && (
            <div className="space-y-8">
              {userChallenges.length === 0 ? (
                <p className="text-md text-gray-400">You haven’t joined any challenges yet.</p>
              ) : (
                userChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="border-b border-[#334155] pb-5 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xl text-white font-medium">{challenge.title}</p>
                      <p className="text-sm text-gray-400">Participants: {challenge.participants}</p>
                      <p className="text-sm text-eco-light">Your CO₂ Saved: {challenge.co2Saved} kg</p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-[#0f172a] border-[#334155] text-eco-light hover:bg-[#334155] font-semibold py-2 px-4 rounded-lg"
                      onClick={() => toast({ title: "Feature Coming Soon", description: "View challenge details in profile is under development" })}
                    >
                      View Leaderboard
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === "comments" && (
            <div className="space-y-8">
              {userComments.length === 0 ? (
                <p className="text-md text-gray-400">You haven’t made any comments yet.</p>
              ) : (
                userComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-[#334155] pb-5"
                  >
                    <p className="text-xl text-white font-medium">On: "{comment.post}"</p>
                    <p className="text-md text-gray-200 mt-2">{comment.content}</p>
                    <p className="text-sm text-gray-400 mt-1">{comment.time}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-6">
              <Button
                variant="outline"
                className="w-full bg-[#0f172a] border-[#334155] text-white hover:bg-[#334155] font-semibold py-4 text-md rounded-lg"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Password change is under development" })}
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full bg-[#0f172a] border-[#334155] text-white hover:bg-[#334155] font-semibold py-4 text-md rounded-lg"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Email update is under development" })}
              >
                Update Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};