/**
 *
 * AuthPage
 *
 */

 import React, {useEffect, useState} from 'react';
 import { findIndex, get, map, replace, set } from 'lodash';
 import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
 
 import Button from '../../components/Button';
 import FormDivider from '../../components/FormDivider';
 import Input from '../../components/InputsIndex';
 import Logo from '../../assets/logo_strapi.png';
 import SocialLink from '../../components/SocialLink';
 
 // Utils
 import auth from '../../utils/auth';
 import request from '../../utils/request';
 
 import form from './forms.json';
 import './styles.css';
 
 const getRequestURL = (authType) => {
    let requestURL;

    switch (authType) {
      case 'login':
        requestURL = 'http://localhost:1337/api/auth/local';
        break;
      case 'register':
        requestURL = 'http://localhost:1337/api/auth/local/register';
        break;
      case 'reset-password':
        requestURL = 'http://localhost:1337/api/auth/reset-password';
        break;
      case 'forgot-password':
        requestURL = 'http://localhost:1337/api/auth/forgot-password';
        break;
      default:
    }

    return requestURL;
  };

   /**
    * Function that allows to set the value to be modified
    * @param {String} formType the auth view type ex: login
    * @param {String} email    Optionnal
    */
    const setForm = (formType, email) => {
        const value = get(form, ['data', formType], {});
    
        if (formType === 'reset-password') {
          set(value, 'code', email);
        }
        return value;
      };

  const generateForm = (search, id, authType) => {
    const params = search
      ? replace(search, '?code=', '')
      : id;
    return setForm(authType, params);
  };

/**
    * Check the URL's params to render the appropriate links
    * @return {Element} Returns navigation links
    */
 const renderLink = (authType) => {
    if (authType === 'login') {
      return (
        <div>
          <Link to="/auth/forgot-password">Forgot Password</Link>
          &nbsp;or&nbsp;
          <Link to="/auth/register">register</Link>
        </div>
      );
    }

    return (
      <div>
        <Link to="/auth/login">Ready to signin</Link>
      </div>
    );
  };

export default function AuthPage() {
   let [state, setState] = useState({ value: {}, errors: [], didCheckErrors: false });
   let { authType, id } = useParams();
   let { search }  = useLocation()
   const navigate = useNavigate();
   
   useEffect(() => {
     setState({ value: generateForm(search, id, authType), errors: [], didCheckErrors: false });
   }, [])
 
   const handleChange = ({ target }) =>
     setState({
       value: { ...state.value, [target.name]: target.value },
     });
 
   const handleSubmit = e => {
     e.preventDefault();
     const body = state.value;
     const requestURL = getRequestURL(authType);
 
     // This line is required for the callback url to redirect your user to app
     if (authType === 'forgot-password') {
       set(body, 'url', 'http://localhost:3000/auth/reset-password');
     }
 
     request(requestURL, { method: 'POST', body: state.value })
       .then(response => {
         auth.setToken(response.jwt, body.rememberMe);
         auth.setUserInfo(response.user, body.rememberMe);
         alert("Redirecting user")
         redirectUser();
       })
       .catch(err => {
         // TODO handle errors for other views
         // This is just an example
         const errors = [
           { name: 'identifier', errors: [err.response.payload.error.message] },
         ];
         setState({ ...state.value, didCheckErrors: !state.didCheckErrors, errors });
       });
   };

   const redirectUser = () => {
    navigate(`/`);
   };
 
     const divStyle =
        authType === 'register'
         ? { marginTop: '3.2rem' }
         : { marginTop: '.9rem' };
     const inputs = get(form, ['views',  authType], []);
    
     const providers = ['facebook', 'github', 'google', 'twitter']; // To remove a provider from the list just delete it from this array...
 
     return (
       <div className="authPage">
         <div className="wrapper">
           <div className="headerContainer">
             { authType === 'register' ? (
               <span>Welcome !</span>
             ) : (
               <img src={Logo} alt="logo" />
             )}
           </div>
           <div className="headerDescription">
             { authType === 'register' ? (
               <span>Please register to access the app.</span>
             ) : (
               ''
             )}
           </div>
           <div className="formContainer" style={divStyle}>
             <div className="container-fluid">
               <div className="row">
                 <div className="col-md-12">
                   {providers.map(provider => (
                     <SocialLink provider={provider} key={provider} />
                   ))}
                 </div>
               </div>
               <FormDivider />
               <form onSubmit={handleSubmit}>
                 <div className="row" style={{ textAlign: 'start' }}>
                   {map(inputs, (input, key) => (
                     <Input
                       autoFocus={key === 0}
                       customBootstrapClass={get(input, 'customBootstrapClass')}
                       didCheckErrors={state.didCheckErrors}
                       errors={get(
                         state.errors,
                         [
                           findIndex(state.errors, ['name', input.name]),
                           'errors',
                         ],
                         []
                       )}
                       key={get(input, 'name')}
                       label={get(input, 'label')}
                       name={get(input, 'name')}
                       onChange={handleChange}
                       placeholder={get(input, 'placeholder')}
                       type={get(input, 'type')}
                       validations={{ required: true }}
                       value={get(state.value, get(input, 'name'), '')}
                     />
                   ))}
                   <div className="col-md-12 buttonContainer">
                     <Button
                       label="Submit"
                       style={{ width: '100%' }}
                       primary
                       type="submit"
                     />
                   </div>
                 </div>
               </form>
             </div>
           </div>
           <div className="linkContainer">{renderLink(authType)}</div>
         </div>
       </div>
     );
 }
