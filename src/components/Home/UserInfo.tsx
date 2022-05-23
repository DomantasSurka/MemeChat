import { FC, useEffect, useState } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import { useStore } from "../../store";
import { getAuth, updateProfile, deleteUser, User } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../shared/firebase';

interface UserInfoProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const UserInfo: FC<UserInfoProps> = ({ isOpened, setIsOpened }) => {
  const currentUser = useStore((state) => state.currentUser);

  const [name, setName] = useState('');

  const handleName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  }

  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const auth = getAuth();
  const handleImageChange = () => {
    if (uploadImage == null) {
      return;
    }
    if (uploadImage.size > 4000000) {
      alert("File is too big. Max size: 4MB");
    }
    console.log("file");
    console.log(uploadImage);
    let fileNameParts = uploadImage.name.split('.');
    let fileExt = fileNameParts.pop();
    let fileName = fileNameParts.join('.');
    fileName.replace("/\\.[^/.]+$/", "");
    if (fileExt == undefined) {
      console.log("ext was undefined!");
      return;
    }
    fileExt = fileExt.toLocaleLowerCase();
    let allowedExt = ['jpg', 'jpeg', 'png', 'gif'];
    if (!allowedExt.includes(fileExt)) {
      console.log(`wrong type ${fileExt} is not supported. File extensions supported: ${allowedExt.join(", ")}`);
      return;
    }

    const imageRef = ref(storage, `images/${fileName}${Math.random()}.${fileExt}`);
    const uploadTask = uploadBytesResumable(imageRef, uploadImage);

    uploadTask.on('state_changed',
      (snapshot) => {
        // // Observe state change events such as progress, pause, and resume
        // // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        // switch (snapshot.state) {
        //   case 'paused':
        //     console.log('Upload is paused');
        //     break;
        //   case 'running':
        //     console.log('Upload is running');
        //     break;
        // }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log("error occured");
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log('File available at', downloadURL);
          updateProfile(auth.currentUser as User, {
            photoURL: downloadURL
          }).then(() => {
            window.location.reload()
            // Profile updated!
            // ...
          }).catch((error) => {
            // An error occurred
            // ...
          });
        });
      }
    );
  }
  const handleChangeName = () => {
    updateProfile(auth.currentUser as User, {
      displayName: name
    }).then(() => {
      window.location.reload()
      // Profile updated!
      // ...
    }).catch((error) => {
      // An error occurred
      // ...
    });
  }

  useEffect(handleImageChange, [uploadImage]);

  const handleDelete = () => {
    deleteUser(auth.currentUser as User).then(() => {
    }).catch((error) => {
    });
  }

  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${isOpened ? "visible opacity-100" : "invisible opacity-0"
        }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-dark mx-2 w-full max-w-[400px] rounded-lg"
      >
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">
              Your Profile
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <input type="file" id="actual-btn" onChange={event => setUploadImage(event.target.files == null ? null : event.target.files[0])} accept=".jpg,.jpeg,.png,.gif" hidden />
            <label htmlFor="actual-btn" className="cursor-pointer">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={IMAGE_PROXY(currentUser?.photoURL as string)}
                alt="image cover"
              />
            </label>
            <div>
              <h1 className="text-xl">{currentUser?.displayName == null ? "Anonimas" : currentUser?.displayName}</h1>
              <p>ID: {currentUser?.uid}</p>
              <p>Email: {currentUser?.email || "None"}</p>
              <p>Phone Number: {currentUser?.phoneNumber || "None"}</p>
            </div>
          </div>

          <div className="change-name">
            <label >Change your name here:</label>
            <input onChange={handleName} className="input" value={name} type="text" placeholder={(currentUser?.displayName == null ? "Anonimas" : currentUser?.displayName) || ""} />
            <button onClick={handleChangeName} className="btn name-btn" type="submit">
              Change
            </button>
          </div>

          <div className="change-name">
            <label>Wanna delete your profile?</label><br />
            <button onClick={handleDelete} className="btn delete-btn" type="submit">
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserInfo;
