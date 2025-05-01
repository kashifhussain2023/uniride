import SafeImage from '@/components/common/SafeImage';

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
    icon: <SafeImage src="../icon/profileIcon.png" alt="Profile" width={24} height={24} />,
    label: 'Profile',
    path: '/profile',
  },
  {
    icon: (
      <SafeImage
        src="../icon/favoriteLocationIcon.png"
        alt="Favorite Location"
        width={24}
        height={24}
      />
    ),
    label: 'Favorite Location',
    path: '/favoriteDestination',
  },
  {
    icon: (
      <SafeImage
        src="../icon/corporateProfileIcon.png"
        alt="Corporate Profile"
        width={24}
        height={24}
      />
    ),
    label: 'Corporate Profile',
    path: '/corporate-profile',
  },
  {
    icon: (
      <SafeImage
        src="../icon/emergencyContactIcon.png"
        alt="Emergency Contact"
        width={24}
        height={24}
      />
    ),
    label: 'Emergency Contact',
    path: '/emergency-contact',
  },
  {
    icon: <SafeImage src="../icon/paymentIcon.png" alt="Payment" width={24} height={24} />,
    label: 'Payment',
    path: '/cards',
  },
  {
    icon: (
      <SafeImage src="../icon/riderHistoryIcon.png" alt="Rider History" width={24} height={24} />
    ),
    label: 'Rider History',
    path: 'riderHistory',
  },
  {
    icon: <SafeImage src="../icon/helpIcon.png" alt="Help" width={24} height={24} />,
    label: 'Help',
    path: '/help',
  },
  {
    icon: <SafeImage src="../icon/LegalIcon.png" alt="Legal" width={24} height={24} />,
    label: 'Legal',
    path: '/legal',
  },
  {
    icon: <SafeImage src="../icon/privacyIcon.png" alt="Privacy Policy" width={24} height={24} />,
    label: 'Privacy Policy',
    path: '/privacyPolicy',
  },
  // { label: "Delete Account", path: "", icon: "../icon/deleteAccountIcon.png" },
];
export const headerIcons = [
  {
    icon: '../icon/profileIcon.png',
    label: 'Request A Ride ',
    path: '/uniride',
  },
  {
    icon: '../icon/favoriteLocationIcon.png',
    label: 'Request For Designated Driver',
    path: '/designated-driver',
  },
  {
    icon: '../icon/corporateProfileIcon.png',
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
