import { useState} from 'react'
import { AiFillEye, AiFillEyeInvisible, AiOutlineUser } from 'react-icons/ai'
import { BiLock } from 'react-icons/bi'
import Link from 'next/link'

const Jobseeker = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  return (
    // <Navbar />
      <div className='bg-[#FAFAFA] px-10 py-14'>
        <div className='bg-white w-full max-w-[600px] border border-gray-300 m-auto px-8 py-12'>
          <h1 className='text-xl text-center mb-7 text-gray-600'>Sign Up</h1>
          <form onSubmit={}>
            <div className='flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3 mb-7'>
              <AiOutlineUser className='text-lg text-gray-500' />
              <input type='text' name='name' value={userData.name} onChange={} placeholder='Name' className='outline-0 w-full text-sm' />
            </div>
            <div className='flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3 mb-7'>
              <AiOutlineUser className='text-lg text-gray-500' />
              <input type='text' name='email' value={userData.email} onChange={} placeholder='Email address' className='outline-0 w-full text-sm' />
            </div>
            <div className='flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3 mb-7'>
              <BiLock className='text-lg text-gray-500' />
              <div className='flex items-center w-full'>
                <input type={showPassword ? 'text' : 'password'} name='password' value={userData.password} onChange={} placeholder='Password' className='outline-0 w-full text-sm pr-3' />
                {
                  showPassword
                  ? <AiFillEyeInvisible onClick={() => setShowPassword(false)} className='cursor-pointer text-gray-500' />
                  : <AiFillEye onClick={() => setShowPassword(true)} className='cursor-pointer text-gray-500' />
                }
              </div>
            </div>
            <div className='flex items-center gap-3 border border-gray-300 rounded-md h-12 px-3'>
              <BiLock className='text-lg text-gray-500' />
              <div className='flex items-center w-full'>
                <input type={showPasswordConfirmation ? 'text' : 'password'} name='passwordConfirmation' value={userData.passwordConfirmation} onChange={} placeholder='Password confirmation' className='outline-0 w-full text-sm pr-3' />
                {
                  showPasswordConfirmation
                  ? <AiFillEyeInvisible onClick={() => setShowPasswordConfirmation(false)} className='cursor-pointer text-gray-500' />
                  : <AiFillEye onClick={() => setShowPasswordConfirmation(true)} className='cursor-pointer text-gray-500' />
                }
              </div>
            </div>
            <button className={`'bg-gray-200 hover:bg-gray-200 cursor-auto' : 'bg-[#504ED7] hover:bg-[#2825C2] cursor-pointer'} transition-[background] text-sm w-full py-3 text-white rounded-sm mt-7`}>
            </button>
          </form>
          <p className='mt-8 text-gray-400 text-sm text-center'>Already have an account? <Link href='/login'><a className='outline-0 text-blue-500'>Sign in</a></Link></p>
        </div>
      </div>
    //   <Footer />
  )
}

export default Jobseeker;