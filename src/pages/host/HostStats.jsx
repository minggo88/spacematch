import React from 'react';
import SellerStats from '../seller/SellerStats';

/**
 * HostStats — thin wrapper around SellerStats with host mode enabled.
 * Provides the same revenue management functionality as the seller system,
 * but routes API calls to host-specific endpoints and adds country filtering.
 */
const HostStats = () => {
    return <SellerStats userRole="host" />;
};

export default HostStats;
