export default function RegisterPage() {
  return (


  <div className="flex min-h-screen bg-[#0F1115]">
    <img
      src="../background.png"
      className="hidden md:block md:w-1/2 h-screen object-cover"
      alt="Background"
    />
    <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0F1115] px-8">
      <div className="w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-2">Create your Account</h2>
        <p className="text-gray-400 mb-10">
          Start watching unlimited movies today
        </p>
        <form action="/login" method="POST" className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <input
              type="full name"
              name="full"
      
              className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Email Address</label>
            <input
              type="email"
              name="email"
          
              className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              name="password"
       
              className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Password Confirm</label>
            <input
              type="password"
              name="password"
        
              className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2 mb-10"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-red-800 py-3 rounded-lg font-bold transition-300"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  </div>

  );
}
