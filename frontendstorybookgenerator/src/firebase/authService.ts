import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    User,
    onAuthStateChanged,
 } from "firebase/auth";
import { auth } from "./config";
import { clearAuth, login } from "../store/slices/authSlice";
import { store } from "../store/store";


// Function to sign up a user with email and password
export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth,email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};


//function to login a user with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

//function to logout a user
export const logout = async() => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  } 
}

//function to sign in with google
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  } 
}

//listener for auth state changes
// export const initAuthListener = async()=>{
//   try {
//     onAuthStateChanged(auth, (user:User|null)=>{
//       if(user){
//         return user;
//       }
//     } )
     
//   } catch (error) {
//     throw error;
//   }
// }

export const initAuthListener = () => {
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      store.dispatch(login({ userData: {
        uid:         user.uid,
        email:       user.email,
        displayName: user.displayName,
        photoURL:    user.photoURL,

    }}));
    } else {
      store.dispatch(clearAuth());
    }
  });
};
  