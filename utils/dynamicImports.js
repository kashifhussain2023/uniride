import dynamic from 'next/dynamic';

// Common Components
export const Layout = dynamic(() => import('@/components/common/Layout'));
export const LocationPickerMap = dynamic(() => import('@/components/common/LocationPickerMap'), {
  ssr: false,
});
export const Review = dynamic(() => import('@/components/common/Review'));
export const RiderInfo = dynamic(() => import('@/components/common/RiderInfo'));
export const SpinnerLoader = dynamic(() => import('@/components/common/SpinnerLoader'));
export const LocationValueModel = dynamic(() =>
  import('@/components/common/model/LocationValueModel')
);
export const MessageModel = dynamic(() => import('@/components/common/model/MessageModel'));

// Presentation Components
export const InnerContent = dynamic(() => import('@/components/presentation/InnerContent'));
export const AddCardForm = dynamic(() => import('@/components/presentation/AddCardForm'));
export const Socket = dynamic(() => import('@/components/presentation/Socket'), {
  ssr: false,
});
