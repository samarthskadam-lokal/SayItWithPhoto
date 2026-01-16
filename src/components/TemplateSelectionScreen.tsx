import { Edit, Sparkles, Download, Share2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toBlob } from 'html-to-image';

interface TemplateSelectionScreenProps {
  croppedImage: string;
  userName: string;
  onTemplateSelect: (template: string) => void;
  onEdit: () => void;
}

const templates = {
  sunrise: {
    name: 'Golden Morning',
    bg: 'https://images.unsplash.com/photo-1640655236999-4cd6dfa12d89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwZ29sZGVuJTIwc2t5fGVufDF8fHx8MTc2ODQ4MzU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'morning'
  },
  morningCoffee: {
    name: 'Coffee Morning',
    bg: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwY29mZmVlJTIwc3VucmlzZXxlbnwxfHx8fDE3Njg0ODM1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'morning'
  },
  morningNature: {
    name: 'Nature Morning',
    bg: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwbmF0dXJlJTIwbGlnaHR8ZW58MXx8fHwxNzY4NDgzNTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'morning'
  },
  morningBeach: {
    name: 'Beach Morning',
    bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwYmVhY2glMjBzdW5yaXNlfGVufDF8fHx8MTc2ODQ4MzU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'morning'
  },
  morningMountain: {
    name: 'Mountain Morning',
    bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHN1bnJpc2UlMjBtb3JuaW5nfGVufDF8fHx8MTc2ODQ4MzU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'morning'
  },
  diwali: {
    name: 'Diwali Lights',
    bg: 'https://images.unsplash.com/photo-1761097332824-a80511520bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBsYW1wcyUyMGxpZ2h0c3xlbnwxfHx8fDE3Njg0ODM1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'diwali'
  },
  fireworks: {
    name: 'Celebration Night',
    bg: 'https://images.unsplash.com/photo-1736188551038-af1eebdb9dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZlJTIwZmlyZXdvcmtzJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY4NDgzNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'diwali'
  },
  diwaliDiya: {
    name: 'Diya Festival',
    bg: 'https://images.unsplash.com/photo-1604928617536-0038297d9f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBkaXlhJTIwbGlnaHRzfGVufDF8fHx8MTc2ODQ4MzU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'diwali'
  },
  diwaliRangoli: {
    name: 'Rangoli Diwali',
    bg: 'https://images.unsplash.com/photo-1609552298677-f299cca1dd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjByYW5nb2xpJTIwZmVzdGl2YWx8ZW58MXx8fHwxNzY4NDgzNTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'diwali'
  },
  diwaliGolden: {
    name: 'Golden Diwali',
    bg: 'https://images.unsplash.com/photo-1636197294777-45ee86a1e248?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBnb2xkZW4lMjBsaWdodHN8ZW58MXx8fHwxNzY4NDgzNTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'diwali'
  },
  christmas: {
    name: 'Christmas Joy',
    bg: 'https://images.unsplash.com/photo-1732937135332-19276893ac6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwbGlnaHRzJTIwZGVjb3JhdGlvbnN8ZW58MXx8fHwxNzY4NDgzNTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'christmas'
  },
  christmasSnow: {
    name: 'Snowy Christmas',
    bg: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBzbm93JTIwbmlnaHR8ZW58MXx8fHwxNzY4NDgzNTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'christmas'
  },
  christmasGifts: {
    name: 'Christmas Gifts',
    bg: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBnaWZ0cyUyMHByZXNlbnRzfGVufDF8fHx8MTc2ODQ4MzU5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'christmas'
  },
  christmasCozy: {
    name: 'Cozy Christmas',
    bg: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBjb3p5JTIwZmlyZXBsYWNlfGVufDF8fHx8MTc2ODQ4MzU5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'christmas'
  },
  christmasLights: {
    name: 'Christmas Lights',
    bg: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBsaWdodHMlMjBkZWNvcmF0aW9uc3xlbnwxfHx8fDE3Njg0ODM1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'christmas'
  },
  birthday: {
    name: 'Birthday Celebration',
    bg: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY4NDc4OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'birthday'
  },
  birthdayCake: {
    name: 'Birthday Cake',
    bg: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjYW5kbGVzfGVufDF8fHx8MTc2ODQ4MzU5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'birthday'
  },
  birthdayParty: {
    name: 'Birthday Party',
    bg: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwY29sb3JmdWx8ZW58MXx8fHwxNzY4NDgzNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'birthday'
  },
  birthdayConfetti: {
    name: 'Birthday Confetti',
    bg: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNvbmZldHRpJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY4NDgzNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'birthday'
  },
  birthdayGold: {
    name: 'Golden Birthday',
    bg: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGdvbGQlMjBiYWxsb29uc3xlbnwxfHx8fDE3Njg0ODM1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'birthday'
  },
  // New Year Templates
  newYearFireworks: {
    name: 'New Year Fireworks',
    bg: 'https://images.unsplash.com/photo-1704399527621-82de0422490c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwY2VsZWJyYXRpb24lMjBmaXJld29ya3N8ZW58MXx8fHwxNzY4NDkxODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'newyear'
  },
  newYearGolden: {
    name: 'Golden New Year',
    bg: 'https://images.unsplash.com/photo-1766849324637-f116ee8747b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwZ29sZGVuJTIwcGFydHl8ZW58MXx8fHwxNzY4NDkxODgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'newyear'
  },
  newYearChampagne: {
    name: 'New Year Champagne',
    bg: 'https://images.unsplash.com/photo-1635045180768-332216aac26c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwY2hhbXBhZ25lJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY4NDkxODgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'newyear'
  },
  // Wedding Templates
  weddingFlowers: {
    name: 'Wedding Flowers',
    bg: 'https://images.unsplash.com/photo-1660765035817-4b686af17664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcm9tYW50aWMlMjBmbG93ZXJzfGVufDF8fHx8MTc2ODQ5MTg3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'wedding'
  },
  weddingCeremony: {
    name: 'Wedding Ceremony',
    bg: 'https://images.unsplash.com/photo-1764670055753-1a190164b2ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBmbG93ZXJzfGVufDF8fHx8MTc2ODQ0MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'wedding'
  },
  weddingElegant: {
    name: 'Elegant Wedding',
    bg: 'https://images.unsplash.com/photo-1752857015591-c1b85c01c461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZWxlZ2FudCUyMGRlY29yYXRpb258ZW58MXx8fHwxNzY4NDkxODgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'wedding'
  },
  // Anniversary Templates
  anniversaryCelebration: {
    name: 'Anniversary Celebration',
    bg: 'https://images.unsplash.com/photo-1758883425621-c5c8e3e5ece5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNlbGVicmF0aW9uJTIwZWxlZ2FudHxlbnwxfHx8fDE3Njg0OTE4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'anniversary'
  },
  anniversaryRomantic: {
    name: 'Romantic Anniversary',
    bg: 'https://images.unsplash.com/photo-1760669346422-976b1bc34ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMHJvbWFudGljJTIwZGlubmVyfGVufDF8fHx8MTc2ODQ5MTg4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'anniversary'
  },
  anniversaryRoses: {
    name: 'Anniversary Roses',
    bg: 'https://images.unsplash.com/photo-1573157941034-ba27a5097323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMHJvc2VzJTIwbG92ZXxlbnwxfHx8fDE3Njg0OTE4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'anniversary'
  },
  // Holi Templates
  holiColors: {
    name: 'Holi Colors',
    bg: 'https://images.unsplash.com/photo-1635792367888-a0719f0b7078?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xpJTIwZmVzdGl2YWwlMjBjb2xvcnN8ZW58MXx8fHwxNzY4NDc2NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'holi'
  },
  holiPowder: {
    name: 'Holi Powder',
    bg: 'https://images.unsplash.com/photo-1551757891-24a8dabd2708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xpJTIwY29sb3IlMjBwb3dkZXIlMjBmZXN0aXZhbHxlbnwxfHx8fDE3Njg0OTE4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'holi'
  },
  holiCelebration: {
    name: 'Holi Celebration',
    bg: 'https://images.unsplash.com/photo-1635792367888-a0719f0b7078?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xpJTIwY2VsZWJyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3Njg0OTE4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'holi'
  }
};

interface Category {
  id: number;
  title: string;
}

interface TemplateAPI {
  id: number;
  title: string | null;
  background_image_url: string;
  aspect_ratio: string;
  image_placeholder: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  name_placeholder: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  languages: string[];
  tag: number;
}

const defaultCategories = [
  { id: 'morning', label: 'Good Morning', color: 'from-orange-500 to-yellow-500' },
  { id: 'diwali', label: 'Diwali', color: 'from-purple-500 to-pink-500' },
  { id: 'christmas', label: 'Christmas', color: 'from-red-500 to-green-500' },
  { id: 'birthday', label: 'Birthday', color: 'from-blue-500 to-purple-500' },
  { id: 'newyear', label: 'New Year', color: 'from-yellow-500 to-green-500' },
  { id: 'wedding', label: 'Wedding', color: 'from-pink-500 to-red-500' },
  { id: 'anniversary', label: 'Anniversary', color: 'from-purple-500 to-pink-500' },
  { id: 'holi', label: 'Holi', color: 'from-pink-500 to-red-500' }
];

export function TemplateSelectionScreen({ 
  croppedImage, 
  userName, 
  onTemplateSelect,
  onEdit 
}: TemplateSelectionScreenProps) {
  const [activeCategory, setActiveCategory] = useState('morning');
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down'>('up');
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [templates, setTemplates] = useState<TemplateAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Fetch categories and templates from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, templatesResponse] = await Promise.all([
          fetch('https://testapi.eazeapp.com/greetings/tags/active/'),
          fetch('https://testapi.eazeapp.com/greetings/templates/')
        ]);
        
        const apiCategories: Category[] = await categoriesResponse.json();
        const apiTemplates: TemplateAPI[] = await templatesResponse.json();
        
        const colorMap: { [key: string]: string } = {
          'Motivational': 'from-purple-500 to-indigo-500',
          'Anniversary': 'from-purple-500 to-pink-500',
          'New Year': 'from-yellow-500 to-green-500',
          'Birthday': 'from-blue-500 to-purple-500',
          'Quotes': 'from-gray-500 to-slate-500',
          'Diwali': 'from-purple-500 to-pink-500',
          'Pongal': 'from-orange-500 to-red-500',
          'Christmas': 'from-red-500 to-green-500'
        };
        
        const mappedCategories = apiCategories.map(cat => ({
          id: cat.title.toLowerCase().replace(/\s+/g, ''),
          label: cat.title,
          color: colorMap[cat.title] || 'from-gray-500 to-gray-600',
          tagId: cat.id
        }));
        
        setCategories(mappedCategories);
        setTemplates(apiTemplates);
        
        if (mappedCategories.length > 0) {
          setActiveCategory(mappedCategories[0].id);
          setActiveTagId(mappedCategories[0].tagId);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Hide swipe indicator after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeIndicator(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const filteredTemplates = templates.filter(
    (template) => template.tag === activeTagId
  );

  // Reset to first template when category changes
  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      setActiveCategory(categoryId);
      setActiveTagId(selectedCategory.tagId);
      setCurrentTemplateIndex(0);
      setShowSwipeIndicator(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const diff = touchStart - touch.clientY;
    
    if (Math.abs(diff) > 10) {
      setShowSwipeIndicator(false);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touch = e.changedTouches[0];
    const diff = touchStart - touch.clientY;
    const minSwipeDistance = 30;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped up - next template
        setSwipeDirection('up');
        goToNextTemplate();
      } else {
        // Swiped down - previous template
        setSwipeDirection('down');
        goToPreviousTemplate();
      }
    }

    setTouchStart(null);
  };

  // Mouse handlers for testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchStart) return;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (touchStart === null) return;
    
    const diff = touchStart - e.clientY;
    const minSwipeDistance = 30;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        setSwipeDirection('up');
        goToNextTemplate();
      } else {
        setSwipeDirection('down');
        goToPreviousTemplate();
      }
    }

    setTouchStart(null);
  };

  const goToNextTemplate = () => {
    setCurrentTemplateIndex((prev) => 
      prev < filteredTemplates.length - 1 ? prev + 1 : prev
    );
  };

  const goToPreviousTemplate = () => {
    setCurrentTemplateIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    );
  };

  const currentTemplate = filteredTemplates[currentTemplateIndex];
  const templateData = currentTemplate;
  const capturePreview = async (): Promise<Blob> => {
    if (!previewRef.current) {
      throw new Error('Preview not available');
    }

    // Wait for all images to load
    const waitForImages = async (element: HTMLElement): Promise<void> => {
      const images = element.querySelectorAll('img');
      const promises: Promise<void>[] = [];

      images.forEach((img) => {
        if (!img.complete) {
          promises.push(
            new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error(`Image failed to load: ${img.src}`));
              }, 10000);

              img.onload = () => {
                clearTimeout(timeout);
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error(`Image failed to load: ${img.src}`));
              };
            })
          );
        }
      });

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    };

    try {
      // Wait for images to load first
      await waitForImages(previewRef.current);
      
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try html-to-image with CORS-friendly settings
      const blob = await toBlob(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset.capture === 'ignore') {
            return false;
          }
          return true;
        }
      });

      if (!blob) {
        throw new Error('Failed to capture image - blob is null');
      }

      return blob;
    } catch (error) {
      console.error('Primary capture method failed, trying fallback:', error);
      
      // Fallback method: Try with simpler options
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fallbackBlob = await toBlob(previewRef.current, {
          cacheBust: false,
          pixelRatio: 1,
          filter: (node) => {
            if (node instanceof HTMLElement && node.dataset.capture === 'ignore') {
              return false;
            }
            return true;
          }
        });

        if (!fallbackBlob) {
          throw new Error('Fallback capture also failed - blob is null');
        }

        return fallbackBlob;
      } catch (fallbackError) {
        console.error('Fallback capture also failed:', fallbackError);
        
        // Final fallback: Try canvas-based capture
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context not available');

          const rect = previewRef.current.getBoundingClientRect();
          canvas.width = rect.width * 2;
          canvas.height = rect.height * 2;
          
          // Draw a simple background
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add text indicating capture failed
          ctx.fillStyle = '#ffffff';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Template Preview', canvas.width / 2, canvas.height / 2);
          ctx.font = '16px Arial';
          ctx.fillText(`User: ${userName}`, canvas.width / 2, canvas.height / 2 + 40);

          return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas capture failed'));
              }
            }, 'image/png');
          });
        } catch (canvasError) {
          console.error('Canvas fallback also failed:', canvasError);
          throw new Error(`All image capture methods failed. Please try again later.`);
        }
      }
    }
  };

  const handleDownload = async () => {
    if (!templateData) {
      alert('No template selected');
      return;
    }

    setDownloading(true);
    try {
      const blob = await capturePreview();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}-template-${templateData.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      const message = error instanceof Error ? error.message : 'Unknown download error';
      alert(`Download failed: ${message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!templateData) {
      alert('No template selected');
      return;
    }

    setSharing(true);
    try {
      const blob = await capturePreview();
      const fileName = `${userName}-template-${templateData.id}.png`;
      const file = new File([blob], fileName, { type: blob.type || 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: 'Check out this festive greeting!'
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('File downloaded since sharing is not supported on this device');
      }
    } catch (error) {
      console.error('Share error:', error);
      const message = error instanceof Error ? error.message : 'Unknown share error';
      alert(`Share failed: ${message}`);
    } finally {
      setSharing(false);
    }
  };

  console.log("xyz",currentTemplate?.background_image_url);
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col py-8 pb-6">
      {/* Header */}
      <div className="px-6 mb-4">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          Choose Template
        </h2>
        <p className="text-gray-400 mt-1">Select your favorite design</p>
      </div>

      {/* Category Tabs */}
      <div className="px-6 mb-4 overflow-x-auto pb-2">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 px-6 overflow-hidden flex flex-col min-h-0">
        {currentTemplate ? (
          <div className="h-full flex flex-col min-h-0">
            {/* Full Template Preview with Swipe */}
            <div 
              ref={previewRef}
              className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black select-none cursor-pointer flex-shrink"
              style={{ aspectRatio: '9/16', maxHeight: '65vh' }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <AnimatePresence mode="wait" custom={swipeDirection}>
                <motion.div
                  key={currentTemplateIndex}
                  custom={swipeDirection}
                  initial={{ 
                    y: swipeDirection === 'up' ? '100%' : '-100%'
                  }}
                  animate={{ 
                    y: 0
                  }}
                  exit={{ 
                    y: swipeDirection === 'up' ? '-100%' : '100%'
                  }}
                  transition={{ 
                    type: 'tween',
                    ease: 'easeInOut',
                    duration: 0.25
                  }}
                  className="absolute inset-0"
                >
                  {/* Background */}
                  <img 
                    src={currentTemplate?.background_image_url}
                    alt={`Template ${currentTemplate.id}`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                    loading="eager"
                    onLoad={() => {
                      console.log('Background image loaded successfully');
                    }}
                    onError={(e: any) => {
                      console.warn('Background image failed to load:', currentTemplate.background_image_url);
                      // Don't hide the image, just log the error
                      // e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

                  {/* Good Morning Text - Top Center */}
                  {/* <div className="absolute top-16 left-0 right-0 text-center px-6 pointer-events-none">
                    <h2 
                      className="text-3xl font-bold text-white mb-3"
                      style={{
                        textShadow: '2px 2px 12px rgba(0,0,0,0.4), 0 0 30px rgba(0,0,0,0.2)'
                      }}
                    >
                      Good Morning
                    </h2>
                    <p 
                      className="text-base text-white/95 leading-relaxed max-w-xs mx-auto"
                      style={{
                        textShadow: '1px 1px 8px rgba(0,0,0,0.5), 0 0 15px rgba(0,0,0,0.3)'
                      }}
                    >
                      "Every morning brings new potential, but only if you make the most of it."
                    </p>
                  </div> */}

                  {/* User Photo - Positioned based on API data */}
                  <div 
                    className="absolute rounded-full overflow-hidden border-2 border-white/60 shadow-2xl pointer-events-none"
                    style={{
                      left: `${currentTemplate.image_placeholder.x}%`,
                      top: `${currentTemplate.image_placeholder.y}%`,
                      width: `${currentTemplate.image_placeholder.width}%`,
                      height: `${currentTemplate.image_placeholder.height}%`
                    }}
                  >
                    <img 
                      src={croppedImage}
                      alt="User preview"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {/* Name Preview - Positioned based on API data */}
                  <div 
                    className="absolute pointer-events-none flex items-center justify-center"
                    style={{
                      left: `${currentTemplate.name_placeholder.x}%`,
                      top: `${currentTemplate.name_placeholder.y}%`,
                      width: `${currentTemplate.name_placeholder.width}%`,
                      height: `${currentTemplate.name_placeholder.height}%`
                    }}
                  >
                    <p 
                      className="text-2xl font-bold text-white text-center"
                      style={{
                        textShadow: '2px 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      {userName}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Edit Button - Bottom Right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                data-capture="ignore"
                className="absolute bottom-2 right-2 z-10 bg-white/25 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/35 transition-all shadow-sm flex items-center gap-1"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
              >
                <Edit size={14} />
                Edit
              </button>

              {/* Swipe Indicator */}
              {showSwipeIndicator && (
                <div data-capture="ignore" className="absolute bottom-1/2 left-0 right-0 flex justify-center items-center pointer-events-none z-20">
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                    <p className="text-white text-xs">↑ Swipe up/down ↓</p>
                  </div>
                </div>
              )}

              {/* Debug: Current Index Display */}
              <div data-capture="ignore" className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none z-20">
                <p className="text-white text-xs">
                  {currentTemplateIndex + 1} / {filteredTemplates.length}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {downloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Download
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {sharing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 size={20} />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No templates in this category yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
