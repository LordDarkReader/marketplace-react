import React, {useState, useEffect} from 'react';
import {getAuth, updateProfile} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {updateDoc, doc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';

/**
 * @return {string}
 */
function Profile() {
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    });
    const {name, email} = formData;
    const onSubmit = async () => {

        try {
            if (auth.currentUser.displayName !== name) {
                await  updateProfile(auth.currentUser, {
                    displayName: name
                });

                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                    name
                });
                toast.success('Profile details updated')
            }
        } catch (error) {
            toast.error('Could not update profile details')
        }
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    };

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    };

    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My profile</p>
                <button className='logOut' type='button' onClick={onLogout}>
                    Logout
                </button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetailsText' >Personal Details</p>
                    <p className='changePersonalDetails' onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prevState) => !prevState);
                    }}>{changeDetails ? 'done' : 'change'}</p>
                </div>
                <div className='profileCard'>
                    <form>
                        <input type='text'
                               id='name'
                               className={!changeDetails ? 'profileName' : 'profileNameActive'}
                               disabled={!changeDetails}
                               value={name}
                               onChange={onChange}
                        />
                        <input type='email'
                               id='email'
                               className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                               disabled={!changeDetails}
                               value={email}
                               onChange={onChange}
                        />
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Profile
