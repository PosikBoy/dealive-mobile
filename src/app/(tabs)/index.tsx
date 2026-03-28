import React from 'react';

import { AuthGuard } from '@/components/guards/AuthGuard/AuthGuard';
import { Orders } from '@/components/screens/Orders/Orders';

const index = () => {
  return (
    <AuthGuard>
      <Orders />
    </AuthGuard>
  );
};

export default index;
