// import React from 'react';
// import { Navigate } from 'react-router-dom';
//
// interface RoleBasedRouteProps {
//     children: React.ReactNode;
//     allowedRoles: string[];
// }
//
// const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
//     // const { userRole } = useAuth();
//
//     if (!allowedRoles.includes(userRole || '')) {
//         return <Navigate to="/unauthorized" />;
//     }
//
//     return <>{children}</>;
// };
//
// export default RoleBasedRoute;