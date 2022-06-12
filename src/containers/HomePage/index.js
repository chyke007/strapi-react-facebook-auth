/**
 *
 * HomePage
 */

 import React from 'react';
 import { useNavigate } from 'react-router-dom';
 
 import Button from '../../components/Button';
 import auth from '../../utils/auth';
 
 export default function HomePage() {
    const navigate = useNavigate()

   return (
       <div style={{ marginTop: '15%' }}>
         <h1>You're now logged in!!!</h1>
         <div style={{ marginTop: '50px' }}>
           <Button
             primary
             onClick={() => {
               auth.clearAppStorage();
              navigate('/auth/login');
             }}
           >
             Logout
           </Button>
         </div>
         <div>
         </div>
       </div>
     );
   }
