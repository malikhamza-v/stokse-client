import { useDispatch, useSelector } from 'react-redux';
import WaitingAnim from '../../../assets/animation/waiting.gif';
import { useCreate } from '../../../utils/hooks';
import {
  setBusiness,
  setStore,
  setUser,
} from '../../../../store/slices/appSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Waiting() {
  const { createData: register } = useCreate();
  const { createData: businessCreate } = useCreate();
  const { createData: storeCreate } = useCreate();

  const userInfo = useSelector((state: any) => state.signup.adminInfo);
  const businessInfo = useSelector((state: any) => state.signup.businessInfo);
  const storeInfo = useSelector((state: any) => state.signup.storeInfo);
  const signCode = useSelector((state: any) => state.signup.code);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const createResgistration = async () => {
    console.log('initializing registration');
    const resPayload = {
      code: signCode,
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      password: userInfo.password,
      role: 'Admin',
    };

    const registerRes = await register('/auth/register/', resPayload, false);
    if (registerRes.status === 200) {
      localStorage.setItem('token', registerRes.data.token);
      localStorage.setItem('user', JSON.stringify(registerRes.data.user));
      dispatch(setUser(registerRes.data.user));

      const createBusinessPayload = {
        name: businessInfo.name,
        admin: registerRes.data.user.id,
      };

      const businessRes = await businessCreate(
        '/business/',
        createBusinessPayload,
        false,
      );

      if (businessRes.status === 200) {
        localStorage.setItem('business', JSON.stringify(businessRes.data));
        dispatch(setBusiness(businessRes.data));

        const createStorePayload = {
          user_id: registerRes.data.user.id,
          business: businessRes.data.id,
          name: storeInfo.name,
          email: storeInfo.email,
          description: storeInfo.description,
          phone: storeInfo.phone,
          city: storeInfo.city,
          country: storeInfo.country,
          address: storeInfo.address,
        };

        const storeRes = await storeCreate(
          '/store/',
          createStorePayload,
          false,
        );

        if (storeRes.status === 200) {
          dispatch(setStore(storeRes.data));
          localStorage.setItem('store', JSON.stringify(storeRes.data));
          navigate('/');
        }
      }
    }
  };

  useEffect(() => {
    createResgistration();
  }, []);

  return (
    <div>
      <div className="my-12">
        <img src={WaitingAnim} alt="waiting" className="mx-auto" />
      </div>
    </div>
  );
}

export default Waiting;
