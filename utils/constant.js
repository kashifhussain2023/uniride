import Image from 'next/image';

export const mainMenuItems = [
  {
    icon: 'DashboardOutlined',
    label: 'Dashboard',
    path: '/uniride',
  },
];
export const profileMenus = [
  // { label: "Profile", path: "/", icon: "AccountCircle" },
  {
    icon: 'Logout',
    label: 'Logout',
    path: '/login',
  },
];
export const menuIcons = [
  {
    icon: <Image src="/icon/profileIcon.png" alt="Profile" width={24} height={24} unoptimized />,
    label: 'Profile',
    path: '/profile',
  },
  {
    icon: (
      <Image
        src="/icon/favoriteLocationIcon.png"
        alt="Favorite Location"
        width={24}
        height={24}
        unoptimized
      />
    ),
    label: 'Favorite Location',
    path: '/favoriteDestination',
  },
  {
    icon: (
      <Image
        src="/icon/corporateProfileIcon.png"
        alt="Corporate Profile"
        width={24}
        height={24}
        unoptimized
      />
    ),
    label: 'Corporate Profile',
    path: '/corporate-profile',
  },
  {
    icon: (
      <Image
        src="/icon/emergencyContactIcon.png"
        alt="Emergency Contact"
        width={24}
        height={24}
        unoptimized
      />
    ),
    label: 'Emergency Contact',
    path: '/emergency-contact',
  },
  {
    icon: <Image src="/icon/paymentIcon.png" alt="Payment" width={24} height={24} unoptimized />,
    label: 'Payment',
    path: '/cards',
  },
  {
    icon: (
      <Image
        src="/icon/riderHistoryIcon.png"
        alt="Rider History"
        width={24}
        height={24}
        unoptimized
      />
    ),
    label: 'Rider History',
    path: 'riderHistory',
  },
  {
    icon: <Image src="/icon/helpIcon.png" alt="Help" width={24} height={24} unoptimized />,
    label: 'Help',
    path: '/help',
  },
  {
    icon: <Image src="/icon/LegalIcon.png" alt="Legal" width={24} height={24} unoptimized />,
    label: 'Legal',
    path: '/legal',
  },
  {
    icon: (
      <Image src="/icon/privacyIcon.png" alt="Privacy Policy" width={24} height={24} unoptimized />
    ),
    label: 'Privacy Policy',
    path: '/privacyPolicy',
  },
  // { label: "Delete Account", path: "", icon: "../icon/deleteAccountIcon.png" },
];
export const headerIcons = [
  {
    icon: '/icon/profileIcon.png',
    label: 'Request A Ride ',
    path: '/uniride',
  },
  {
    icon: '/icon/favoriteLocationIcon.png',
    label: 'Request For Designated Driver',
    path: '/designated-driver',
  },
  {
    icon: '/icon/corporateProfileIcon.png',
    label: 'Schedule Ride',
    path: '/schedule-ride',
  },
];
export const scheduleRideList = [
  {
    date: '2023 Dec 23',
    endPoint:
      'INTERNATIONAL SC OO O INFORMATICS & MANAGEMENT, Mahaveer Marg. Sector 12, Mansarovar, Jaipur, Rajasthan 302020, India',
    startPoint:
      'Shop No.40. Mira Marg Shopping Center, Sector Ward Number 43, Sector 101, Mansarovar, Jaipur, Rajasthan 302020, India',
    time: '06:25 PM',
  },
];
