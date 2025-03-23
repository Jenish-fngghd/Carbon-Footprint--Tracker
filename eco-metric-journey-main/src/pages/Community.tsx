// src/pages/Community.tsx
import React, { useState } from "react";
import { User, Users, MessageSquare, Heart, Share2, Award, TrendingUp, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";

// Define the Post type with initials as an optional property
interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
  comments: { author: string; content: string; time: string }[];
  shares: number;
  tags: string[];
  initials?: string; // Add initials as optional
}

// Separate PostCard component to handle individual post logic
interface User {
  firstName: string;
  lastName: string;
  avatar?: string;
}

const PostCard: React.FC<{ post: Post; handleLike: (postId: number) => void; handleCommentSubmit: (postId: number, comment: string) => void; handleShare: (postId: number) => void; user: User | null }> = ({ post, handleLike, handleCommentSubmit, handleShare, user }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  return (
    <Card key={post.id} className="bg-[#1e293b] border-[#334155] shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatar} alt={post.author} />
              <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-bold">
                {post.initials || post.author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{post.author}</h3>
              <p className="text-xs text-gray-400">{post.time}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-gray-200">{post.content}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-eco-dark text-eco-light text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-[#334155] py-3 flex flex-col">
        <div className="flex justify-between w-full mb-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" onClick={() => handleLike(post.id)}>
            <Heart className={`h-4 w-4 mr-2 ${post.liked ? "text-red-500 fill-red-500" : ""}`} /> {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-eco-light" onClick={() => setShowCommentInput(!showCommentInput)}>
            <MessageSquare className="h-4 w-4 mr-2" /> {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-eco-light" onClick={() => handleShare(post.id)}>
            <Share2 className="h-4 w-4 mr-2" /> {post.shares}
          </Button>
        </div>
        {showCommentInput && (
          <div className="w-full mt-2">
            <div className="flex items-center gap-2">
              <Input
                className="bg-[#0f172a] border-[#334155] text-white flex-1"
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <Button
                size="sm"
                className="bg-[#3b82f6] hover:bg-[#2563eb]"
                onClick={() => {
                  handleCommentSubmit(post.id, commentContent);
                  setCommentContent("");
                  setShowCommentInput(false);
                }}
              >
                Enter
              </Button>
            </div>
          </div>
        )}
        {post.comments.length > 0 && (
          <div className="w-full mt-4 space-y-2">
            {post.comments.map((comment, index) => (
              <div key={index} className="flex items-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={comment.author} />
                  <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-bold">
                    {comment.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-[#334155] p-2 rounded-lg">
                  <p className="text-sm text-white font-medium">{comment.author}</p>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                  <p className="text-xs text-gray-400">{comment.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const Community: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Posts state
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, author: "JaneEco", avatar: "https://i.pravatar.cc/150?img=1", time: "2 hours ago", content: "Just reduced my carbon footprint by 15% this month! Here's how I did it...", likes: 42, liked: false, comments: [], shares: 5, tags: ["carbon-reduction", "sustainability"], initials: "JE" },
    { id: 2, author: "GreenTech", avatar: "https://i.pravatar.cc/150?img=2", time: "1 day ago", content: "Our community challenge this week: Switch to renewable energy sources where possible. Share your experiences below!", likes: 78, liked: false, comments: [], shares: 15, tags: ["challenge", "renewable-energy"], initials: "GT" },
    { id: 3, author: "EcoWarrior", avatar: "https://i.pravatar.cc/150?img=3", time: "3 days ago", content: "The data from my Carbon Tracker shows a clear correlation between my commute changes and CO₂ reduction. Carpooling works!", likes: 105, liked: false, comments: [], shares: 27, tags: ["data-analysis", "transportation"], initials: "EW" },
  ]);

  // Events state
  const [events, setEvents] = useState([
    { id: 1, title: "Virtual Sustainability Workshop", date: "May 15, 2023", attendees: 87, type: "Online", joined: false, description: "Learn eco-friendly practices from experts.", location: "Zoom Link: [TBD]" },
    { id: 2, title: "Community Clean-up Day", date: "May 22, 2023", attendees: 34, type: "In-person", joined: false, description: "Help clean up local parks.", location: "Central Park, NY" },
    { id: 3, title: "Carbon Footprint Reduction Challenge", date: "June 1-30, 2023", attendees: 156, type: "Hybrid", joined: false, description: "Reduce your CO₂ over 30 days.", location: "Online & Local" },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Challenges state
  const [challengeJoined, setChallengeJoined] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [challengeParticipants, setChallengeParticipants] = useState([
    { id: 1, name: "EcoWarrior", co2Saved: 2500 },
    { id: 2, name: "GreenTech", co2Saved: 1800 },
    { id: 3, name: "JaneEco", co2Saved: 1500 },
    { id: 4, name: "SustainableLife", co2Saved: 1200 },
    { id: 5, name: "EarthFirst", co2Saved: 900 },
  ]);
  const totalCo2Saved = challengeParticipants.reduce((sum, p) => sum + p.co2Saved, 0);

  // Post actions
  const handlePostSubmit = () => {
    if (!user) return toast({ title: "Error", description: "Please sign in to post.", variant: "destructive" });
    if (!newPostContent.trim()) return toast({ title: "Error", description: "Post content cannot be empty.", variant: "destructive" });
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    const newPost = {
      id: posts.length + 1,
      author: `${user.firstName}${user.lastName}`,
      avatar: user.avatar || "",
      time: "Just now",
      content: newPostContent,
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      tags: ["user-post"],
      initials,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    toast({ title: "Posted", description: "Your post has been shared!" });
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p)));
  };

  const handleCommentSubmit = (postId: number, comment: string) => {
    if (!comment.trim()) return;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { author: `${user?.firstName}${user?.lastName}`, content: comment, time: "Just now" }] } : p)));
    toast({ title: "Commented", description: "Your comment has been added!" });
  };

  const handleShare = (postId: number) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p)));
    toast({ title: "Shared", description: "Post shared (simulated)!" });
  };

  // Event actions
  const handleJoinEvent = (eventId: number) => {
    if (!user) return toast({ title: "Error", description: "Please sign in to join events.", variant: "destructive" });
    setEvents(events.map((e) => (e.id === eventId ? { ...e, joined: true, attendees: e.attendees + 1 } : e)));
    toast({ title: "Joined", description: "You’ve joined the event!" });
  };

  interface Event {
    id: number;
    title: string;
    date: string;
    attendees: number;
    type: string;
    joined: boolean;
    description: string;
    location: string;
  }

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  // Challenge actions
  const handleJoinChallenge = () => {
    if (!user) return toast({ title: "Error", description: "Please sign in to join the challenge.", variant: "destructive" });
    setChallengeJoined(true);
    setChallengeParticipants([...challengeParticipants, { id: challengeParticipants.length + 1, name: `${user.firstName}${user.lastName}`, co2Saved: 0 }]);
    toast({ title: "Joined", description: "You’re now part of the challenge!" });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Community</h1>
          <p className="mt-3 text-lg text-gray-300">Connect with like-minded individuals committed to reducing carbon footprints</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="posts" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-[#1e293b] border-[#334155]">
                  <TabsTrigger value="posts" className="text-gray-300 data-[state=active]:bg-[#334155] data-[state=active]:text-[#3b82f6]">
                    <MessageSquare className="h-4 w-4 mr-2" /> Posts
                  </TabsTrigger>
                  <TabsTrigger value="events" className="text-gray-300 data-[state=active]:bg-[#334155] data-[state=active]:text-[#3b82f6]">
                    <Users className="h-4 w-4 mr-2" /> Events
                  </TabsTrigger>
                  <TabsTrigger value="challenges" className="text-gray-300 data-[state=active]:bg-[#334155] data-[state=active]:text-[#3b82f6]">
                    <Award className="h-4 w-4 mr-2" /> Challenges
                  </TabsTrigger>
                </TabsList>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input className="pl-9 bg-[#1e293b] border-[#334155] text-white" placeholder="Search community..." />
                </div>
              </div>

              {/* New Post Input */}
              <Card className="mb-6 bg-[#1e293b] border-[#334155] shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt="Your avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-bold">
                        {user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        className="bg-[#0f172a] border-[#334155] text-white"
                        placeholder="Share your sustainability journey..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t border-[#334155] py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#334155]">
                      <Users className="h-4 w-4 mr-2" /> Tag People
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#334155]">
                      <Share2 className="h-4 w-4 mr-2" /> Add Media
                    </Button>
                  </div>
                  <Button size="sm" onClick={handlePostSubmit} className="bg-[#3b82f6] hover:bg-[#2563eb]">Post</Button>
                </CardFooter>
              </Card>

              {/* Posts */}
              <TabsContent value="posts" className="mt-0">
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      handleLike={handleLike}
                      handleCommentSubmit={handleCommentSubmit}
                      handleShare={handleShare}
                      user={user}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Events */}
              <TabsContent value="events" className="mt-0">
                <div className="space-y-6">
                  {events.map((event) => (
                    <Card key={event.id} className="bg-[#1e293b] border-[#334155] shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg text-white">{event.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full text-white ${
                            event.type === "Online" ? "bg-blue-600" : event.type === "In-person" ? "bg-green-600" : "bg-purple-600"
                          }`}>
                            {event.type}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300 mb-2"><span className="font-medium">Date:</span> {event.date}</p>
                        <p className="text-sm text-gray-300"><span className="font-medium">Participants:</span> {event.attendees} attendees</p>
                      </CardContent>
                      <CardFooter className="border-t border-[#334155] py-3">
                        {event.joined ? (
                          <Button
                            variant="outline"
                            className="w-full bg-[#0f172a] border-[#334155] text-eco-light hover:bg-[#334155] font-semibold"
                            onClick={() => handleViewEvent(event)}
                          >
                            View Details
                          </Button>
                        ) : (
                          <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb]" onClick={() => handleJoinEvent(event.id)}>
                            Join Event
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                  {selectedEvent && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                      <Card className="bg-[#1e293b] border-[#334155] w-full max-w-md rounded-xl shadow-2xl animate-slide-up">
                        <CardHeader className="relative bg-gradient-to-r from-eco-dark to-[#0f172a] p-6 rounded-t-xl">
                          <h3 className="text-2xl font-extrabold text-white">{selectedEvent.title}</h3>
                          <span className={`absolute top-4 right-4 px-2 py-1 text-xs rounded-full text-white ${
                            selectedEvent.type === "Online" ? "bg-blue-600" : selectedEvent.type === "In-person" ? "bg-green-600" : "bg-purple-600"
                          }`}>
                            {selectedEvent.type}
                          </span>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Date</p>
                              <p className="text-md text-white font-medium">{selectedEvent.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Attendees</p>
                              <p className="text-md text-white font-medium">{selectedEvent.attendees}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Description</p>
                            <p className="text-md text-white font-medium">{selectedEvent.description}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Location</p>
                            <p className="text-md text-white font-medium">{selectedEvent.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Your Info</p>
                            <p className="text-md text-white font-medium">{user?.firstName} {user?.lastName} ({user?.email})</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-6 border-t border-[#334155]">
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700 font-semibold py-3 rounded-lg"
                            onClick={() => setSelectedEvent(null)}
                          >
                            Close
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Challenges */}
              <TabsContent value="challenges" className="mt-0">
                <Card className="bg-[#1e293b] border-eco-light/50 shadow-lg">
                  <CardHeader>
                    <h3 className="font-semibold text-lg text-white flex items-center">
                      <Award className="h-5 w-5 mr-2 text-eco-light" /> Current Challenge: 30-Day Energy Reduction
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200 mb-4">
                      Track your energy usage and implement at least 3 reduction strategies over the next month.
                      Share your progress with #EnergyChallenge.
                    </p>
                    <div className="flex justify-between items-center p-3 bg-eco-dark rounded-lg">
                      <div>
                        <p className="font-medium text-white">Challenge Progress</p>
                        <p className="text-sm text-gray-400">15 days remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{challengeParticipants.length} participants</p>
                        <p className="text-sm text-eco-light">{totalCo2Saved} kg CO₂ saved</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-[#334155] py-3">
                    <Button
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb]"
                      onClick={challengeJoined ? () => setShowLeaderboard(!showLeaderboard) : handleJoinChallenge}
                    >
                      {challengeJoined ? (showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard") : "Join Challenge"}
                    </Button>
                  </CardFooter>
                </Card>
                {challengeJoined && showLeaderboard && (
                  <Card className="mt-6 bg-[#1e293b] border-[#334155] shadow-lg rounded-xl">
                    <CardHeader>
                      <h3 className="font-semibold text-xl text-white flex items-center">
                        <Award className="h-5 w-5 mr-2 text-eco-light" /> Leaderboard
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {challengeParticipants
                          .sort((a, b) => b.co2Saved - a.co2Saved)
                          .map((participant, index) => (
                            <div
                              key={participant.id}
                              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                index < 3 ? "bg-eco-dark/50" : "bg-[#0f172a]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`text-md font-bold ${index < 3 ? "text-eco-light" : "text-gray-300"}`}>
                                  {index + 1}
                                </span>
                                <p className="text-md text-white font-medium">{participant.name}</p>
                              </div>
                              <p className="text-sm text-eco-light font-semibold">{participant.co2Saved} kg CO₂</p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-[#1e293b] border-[#334155] shadow-lg">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-white">Community Impact</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-eco-dark rounded-lg">
                    <p className="text-2xl font-bold text-eco-light">5,280</p>
                    <p className="text-xs text-gray-400">Members</p>
                  </div>
                  <div className="text-center p-3 bg-eco-dark rounded-lg">
                    <p className="text-2xl font-bold text-eco-light">128K</p>
                    <p className="text-xs text-gray-400">CO₂ Reduced (kg)</p>
                  </div>
                  <div className="text-center p-3 bg-eco-dark rounded-lg">
                    <p className="text-2xl font-bold text-eco-light">42</p>
                    <p className="text-xs text-gray-400">Events</p>
                  </div>
                  <div className="text-center p-3 bg-eco-dark rounded-lg">
                    <p className="text-2xl font-bold text-eco-light">894</p>
                    <p className="text-xs text-gray-400">Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b] border-[#334155] shadow-lg">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-white flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-eco-light" /> Trending Topics
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["#EnergyChallenge", "#SolarPanels", "#FoodWaste", "#GreenTransport", "#WaterConservation"].map((topic, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-[#334155] rounded-md transition-colors">
                      <p className="text-sm text-white">{topic}</p>
                      <span className="text-xs text-gray-400">{[128, 87, 64, 53, 42][i]} posts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b] border-[#334155] shadow-lg">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-white flex items-center">
                  <Award className="h-4 w-4 mr-2 text-eco-light" /> Top Contributors
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "EcoWarrior", points: 1240, avatar: "https://i.pravatar.cc/150?img=3" },
                    { name: "GreenTech", points: 980, avatar: "https://i.pravatar.cc/150?img=2" },
                    { name: "JaneEco", points: 870, avatar: "https://i.pravatar.cc/150?img=1" },
                    { name: "SustainableLife", points: 750, avatar: "https://i.pravatar.cc/150?img=4" },
                    { name: "EarthFirst", points: 620, avatar: "https://i.pravatar.cc/150?img=5" },
                  ].map((contributor, index) => (
                    <div key={contributor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contributor.avatar} alt={contributor.name} />
                          </Avatar>
                          {index < 3 && (
                            <div className="absolute -top-1 -right-1 bg-eco-light rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-[#0f172a] font-bold">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-white font-medium">{contributor.name}</p>
                      </div>
                      <p className="text-xs font-semibold text-eco-light">{contributor.points} pts</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#334155] py-3">
                <Button variant="outline" size="sm" className="w-full bg-[#0f172a] border-[#334155] text-white hover:bg-[#334155]">
                  View Leaderboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;