/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LabelInput } from '../../components/commonComponents';
import {
  ArrowRight,
  DescriptionSVG,
  EmailSVG,
  LocationSVG,
  PhoneSVG,
  StoreSVG,
} from '../../utils/svg';
import { useCreate } from '../../utils/hooks';
import { SecondaryButton } from '../../components/commonComponents/buttons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAppData } from '../../../store/slices/appSlice';
import { resetCart } from '../../../store/slices/cartSlice';
import { isElectron } from '../../utils/methods';

function Setting() {
  const [appVersion, setAppVersion] = useState<any>(null);

  const user = useSelector((state: any) => state.app.user);

  const settingsOptions = [
    {
      label: 'Categories',
      description: 'Manage categories of your products.',
      link: '/setting/categories',
      onlyForAdmin: false,
    },
    {
      label: 'Brands',
      description: 'Manage brands of your products.',
      link: '/setting/brands',
      onlyForAdmin: false,
    },
    {
      label: 'Payment Methods',
      description: 'Manage payment methods of your store.',
      link: '/setting/payment-methods',
      onlyForAdmin: false,
    },
    {
      label: 'Taxes',
      description: 'Manage default taxes of your store.',
      link: '/setting/taxes',
      onlyForAdmin: false,
    },
    {
      label: 'Stores',
      description: 'Manage stores for your business.',
      link: '/setting/stores',
      onlyForAdmin: true,
    },
    {
      label: 'Managers',
      description: 'Manage managers of your stores.',
      link: '/setting/managers',
      onlyForAdmin: true,
    },
    {
      label: 'Store Settings',
      description: 'Manage settings of your stores.',
      link: '/setting/store',
      onlyForAdmin: true,
    },
    {
      label: 'App activites',
      description: 'See all activities at your store.',
      link: '/setting/logs',
      onlyForAdmin: false,
    },
  ];

  // [info]: hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: logoutLoading, createData: logout } = useCreate();

  // [info]: methods
  const handleLogout = () => {
    logout('/auth/logout/', {}, false)
      .then((res) => {
        if (res.status === 200) {
          return true;
        }
        return false;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        localStorage.clear();
        dispatch(resetCart());
        dispatch(resetAppData());
        navigate('/sign-in');
      });
  };

  const checkForUpdate = async () => {
    if (isElectron()) {
      const response =
        await window.electron.ipcRenderer.invoke('check-for-updates');
      if (response.error) {
        toast.error(response.message);
      }
    }
  };

  const getAppVersion = async () => {
    const version = require('../../../../release/app/package.json').version;

    setAppVersion(version);
  };

  useEffect(() => {
    if (isElectron()) {
      getAppVersion();
    } else {
      setAppVersion(__APP_VERSION__);
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto">
      {/* <div className="px-16 pt-16 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Setting</h2>
          <p className="text-gray-500">Manage you store settings here.</p>
        </div>
      </div> */}
      <div className="px-4 md:px-16 py-8">
        <div className="relative mx-auto break-words bg-white w-full mb-6 rounded-xl mt-16">
          <div className="grid grid-cols-2">
            <div className="rounded-lg p-8 mb-12">
              <div className="flex items-center gap-6">
                <div>
                  <div class="avatar">
                    <div class="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-2xl">Store One of Stokse</p>
                  <p className="text-gray-500">Created On: 25 Jan 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-6 flex flex-col">
            <div>
              <h2 className="font-bold text-2xl">Settings</h2>
              <p className="text-gray-500">
                Manage your store settings effortlessly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {settingsOptions.map((option) => {
                if (option.onlyForAdmin && user?.role !== 'Admin') {
                  return (
                    <div className="relative">
                      <div className="border opacity-65 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50">
                        <div>
                          <p className="font-bold">{option.label}</p>
                          <p className="text-gray-600">{option.description}</p>
                        </div>
                        <ArrowRight />
                      </div>

                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-gray-500 px-4 py-2 rounded-lg text-white">
                        <p>Only for admins</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <Link to={option.link} key={option.link}>
                      <div className="border p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50">
                        <div>
                          <p className="font-bold">{option.label}</p>
                          <p className="text-gray-600">{option.description}</p>
                        </div>
                        <ArrowRight />
                      </div>
                    </Link>
                  );
                }
              })}

              {isElectron() && (
                <div
                  onClick={checkForUpdate}
                  className="border p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50"
                >
                  <div>
                    <p className="font-bold">Check for updates</p>
                    <p className="text-gray-600">
                      Always update your app to latest version.
                    </p>
                  </div>
                  <ArrowRight />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-green-800 text-sm font-medium">
            Current app version is{' '}
            <span className="badge badge-neutral cursor-pointer ml-2">
              v{appVersion || 'n/a'}
            </span>
          </p>
          <div className="w-fit">
            <SecondaryButton
              label="Logout"
              loading={logoutLoading}
              onClickAction={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
