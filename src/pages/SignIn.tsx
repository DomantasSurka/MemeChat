import {
  AuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  EmailAuthProvider,
  getAuth,
  updateProfile,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { FC, useState } from "react";

import Alert from "../components/Alert";
import { Navigate } from "react-router-dom";
import { auth } from "../shared/firebase";
import { useQueryParams } from "../hooks/useQueryParams";
import { useStore } from "../store";
import { list } from "firebase/storage";
import '../styles/Custom.css';


const SignIn: FC = () => {
  const { redirect } = useQueryParams();

  const currentUser = useStore((state) => state.currentUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const [shake, setShake] = useState(false);
  const [ccss, setCcss] = useState({ data: {}, x:0, y:0 });
  const [meme, setMeme] = useState({wasSet: false, data: {}});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorForm, setErrorForm] = useState('');

  const getValueBetween = (a : number, b : number, px : number) => {
    var sign = Math.random() >= .5 ? 1 : -1;
    var num = Math.random() * 75 + 25
    var x = num * sign + px;
    if(x < a){
      return a;
    } else if(x > b){
      return b;
    }
    return x;
  }

  const handleSignInWithEmail = () => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrorForm(errorCode);
          });
    });}

  const handleSingUpWithEmail = () => {
    setPersistence(auth, browserSessionPersistence).then(() => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          handleChangeName();
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          setErrorForm(errorCode);
          // ..
        });
  });}

  const handleChangeName = () => {
    updateProfile(auth.currentUser as User, {
      displayName: "Anonimas"
    }).then(() => {
    }).catch((error) => {
    });
  }

  const handleSignIn = (provider: AuthProvider) => {
    // const chance = Math.random();
    // if(chance > 0.15){
    //   // Button begins to shake
    //   setShake(true);
    //   const x = getValueBetween(-300, 300, ccss.x);
    //   const y = getValueBetween(-200, 200, ccss.y);
    //   setCcss(
    //     {
    //       data: {
    //       position: "relative",
    //       transform: `translate(${x}px, ${y}px)`,
    //       transition: `all 0.15s ease-out`
    //     },
    //     x:x,
    //     y:y
    //   });
    //   // Buttons stops to shake after 2 seconds
    //   setTimeout(() => setShake(false), 2000);
    //   return;
    // }
    setLoading(true);
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((res) => {
          console.log(res.user);
        })
        .catch((err) => {
          setIsAlertOpened(true);
          setError(`Error: ${err.code}`);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  }

  const handlePassword = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  }

  const getCustomStyle = () => {
    if(meme.wasSet) return meme.data;
    var dt = getCustomStyle2();
    setMeme({wasSet: true, data: dt});
    return dt;
  }

  const getCustomStyle2 = () => {
    const rnd = Math.random();
    console.log(rnd);
    if(rnd <= .5){
      const lis = [
        'https://c.tenor.com/mTkm08XB2YQAAAAC/rickroll-rick-astley.gif',
        'https://c.tenor.com/eBltHZ96be4AAAAd/dans-opgeven.gif',
        'https://c.tenor.com/yheo1GGu3FwAAAAd/rick-roll-rick-ashley.gif',
        'https://c.tenor.com/NS_04C7q6ksAAAAM/p3.gif',
        'https://c.tenor.com/u5lLmAvzkiYAAAAM/rick-astley-lol.gif',
        'https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif',
        'https://media.giphy.com/media/FWi1f9Wn2hubC/giphy.gif',
        'https://media.giphy.com/media/5kq0GCjHA8Rwc/giphy.gif',
        'https://media.giphy.com/media/pxy9QQUMF0glq/giphy.gif',
        'https://media.giphy.com/media/7Ob5uwAwmTWLe/giphy.gif',
        'https://media.giphy.com/media/FbPsiH5HTH1Di/giphy.gif'
      ];
      const lnk = lis[Math.floor(Math.random()*lis.length)];
      return {
        backgroundImage: `linear-gradient(rgba(36,37,38,0.5), rgba(36,37,38,0.5)), url('${lnk}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    } else return {}
  }

  if (currentUser) return <Navigate to={redirect || "/"} />;

  return (
    <>
      <div className="div-max px-[5vw] py-5 flex justify-center lg:py-10" style={getCustomStyle()}>
        <div className="w-full max-w-[1100px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <img className="h-8 w-8" src="/icon.svg" alt="" />
              <span className="text-2xl">MEMECHAT</span>
            </div>
            <a
              href="https://github.com/DomantasSurka/MemeChat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xl"
            >
              <i className="bx bxl-github"></i>
              <span>Github</span>
            </a>
          </div>

          <div className="flex flex-col-reverse gap-10 md:mt-5 md:flex-row md:gap-5 lg:mt-10">
            <div className="flex-1">
              <img className="h-auto w-full" src="/illustration.svg" alt="" />
            </div>

            <div className="mt-12 flex flex-1 flex-col items-center gap-4 md:items-start lg:mt-24">
              <h1 className="text-center text-3xl md:text-left md:text-4xl">
                The best place for messaging
              </h1>
              <p className="text-center text-xl md:text-left md:text-2xl my-3">
                Try out a new and fun way of chatting by only using gifs, emojis and images!
              </p>
              <div>
                <h1 className="text-center text-xl md:text-left md:text-2xl my-3">LOGIN / REGISTER</h1>
                {/* Labels and inputs for form data */}
                <input onChange={handleEmail} className="input input-first"
                       value={email} type="email" placeholder="Email"/><br/>

                <input onChange={handlePassword} className="input"
                       value={password} type="password" placeholder="Password"/><br/>
                <div className="center">
                <button onClick={handleSignInWithEmail} className="btn login-btn" type="submit">
                  Login
                </button>
                <button onClick={handleSingUpWithEmail} className="btn register-btn" type="submit">
                  Register
                </button>
                  <p className="error">{errorForm}</p>
                </div>
                <button
                    disabled={loading}
                    onClick={() => handleSignIn(new GoogleAuthProvider())}
                    className={shake ? "google-btn flex min-w-[250px] cursor-pointer items-center gap-3 rounded-md p-3 text-black transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75 shake" : "google-btn flex min-w-[250px] cursor-pointer items-center gap-3 rounded-md p-3 text-black transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"}>
                  <img className="h-6 w-6" src="/google.svg" alt="" />
                  <span>Login with Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={error}
        isError
      />
    </>
  );
};

export default SignIn;
