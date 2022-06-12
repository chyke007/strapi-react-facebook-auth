/**
 *
 * ConnectPage
 *
 */

 import React, { useEffect } from 'react';

 import { useParams, Navigate, useLocation } from 'react-router-dom';
 
 
 // Utils
 import auth from '../../utils/auth';
 import request from '../../utils/request';
 
 const redirectUser = path => {
    <Navigate to={path} />;
   };

 export default function ConnectPage() {
    let { provider } = useParams();
    let { search }  = useLocation()
   // We only use this lifecycle because it's only mounted once and the saga already handle
   // the redirections depending on the API response
 
   // NOTE: YOU can delete this container and do the logic in the HomePage formContainer
   // This implementation was just made for the sake of the example and to simplify the logic
   useEffect(() => {
     const requestURL = `http://localhost:1337/api/auth/${provider}/callback${search}`;
 
     request(requestURL, { method: 'GET' })
       .then(response => {
         auth.setToken(response.jwt, true);
         auth.setUserInfo(response.user, true);
         redirectUser('/');
       })
       .catch(err => {
         console.log(err.response.payload);
         redirectUser('/auth/login');
       });
   })
 
   return (
       <div>
         <h1>Retrieving your token and checking its validity</h1>
       </div>
     );
 }