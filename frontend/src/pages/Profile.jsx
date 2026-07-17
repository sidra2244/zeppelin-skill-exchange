import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import ProfileInfo from '../components/profile/ProfileInfo';
import LocationInfo from '../components/profile/LocationInfo';
import SecuritySettings from '../components/profile/SecuritySettings';
import { COLORS } from '../utils/constants';

const Profile = () => {
  const colors = COLORS;

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="User Profile" />
      
      <Card className="mb-6">
        <h3 className="mb-5 text-lg font-semibold lg:mb-7" style={{ color: colors.text }}>
          My Profile
        </h3>
        <ProfileInfo />
      </Card>

      <Card className="mb-6">
        <LocationInfo />
      </Card>

      {/* <Card>
        <SecuritySettings />
      </Card> */}
    </div>
  );
};

export default Profile;