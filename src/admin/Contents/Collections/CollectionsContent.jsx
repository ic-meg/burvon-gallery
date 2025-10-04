import React from 'react';
import { Outlet } from 'react-router-dom';

const CollectionsContent = () => {
  // Acts as a parent for collection child routes. The actual collection pages render into the nested Outlet.
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CollectionsContent;
