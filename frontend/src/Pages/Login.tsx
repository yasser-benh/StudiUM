// src/Pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/accueil');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full m-[-50px]">
      <motion.form
        onSubmit={handleLogin}
        className="bg-white py-8 px-10  rounded-xl shadow-lg w-full max-w-xl space-y-6 border border-gray-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center " variants={itemVariants}>
        <motion.h1 
            whileHover={{ scale: 1.02 }}
            className=" text-3xl font-bold text-[#212529] text-center py-7">
                Studi<span className="text-[#6F42C1] w-full">UM</span>
                
          </motion.h1>
          <motion.h1 
            className="text-3xl font-bold text-gray-800"
            whileHover={{ scale: 1.02 }}
          >
            Connexion
          </motion.h1>
          <p className="text-gray-500 mt-2">Accédez à votre compte</p>
        </motion.div>

        {error && (
          <motion.div 
            className="p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div className="space-y-4" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <motion.input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="w-full px-4 py-3 border  border-gray-300 rounded-lg  outline-none "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <motion.input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border  border-gray-300 rounded-lg  outline-none "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              whileFocus={{ scale: 1.01}}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4  rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          <motion.a 
            href="#"
            className="text-sm text-[#6e42c196] hover:text-[#6F42C1]"
            whileHover={{ scale: 1.05 }}
            
          >
            Mot de passe oublié ?
          </motion.a>
        </motion.div>

        <motion.button
          type="submit"
          className="w-full bg-[#6e42c1ca] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6F42C1]  shadow-md flex justify-center items-center"
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Se connecter'
          )}
        </motion.button>

        <motion.div 
          className="text-center text-sm text-gray-500"
          variants={itemVariants}
        >
          Pas de compte ?{' '}
          <motion.a 
            href="#" 
            className="font-medium text-blue-600 hover:text-blue-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            S'inscrire
          </motion.a>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Login;