const SignInForm = () => {
  return (
    <div className='bg-[#F9F7FF] w-[400px] p-6 rounded-3xl'>
      <h1>Sign In</h1>
      <form>
        <input type='email' placeholder='Email' />
        <input type='password' placeholder='Password' />
        <button type='submit'>Sign In</button>
      </form>
    </div>
  );
};

export { SignInForm };
