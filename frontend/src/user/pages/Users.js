import React, { Fragment, useEffect, useState } from "react"
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import UsersList from "../components/UsersList"
export default function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(null);
  useEffect(() => {
    async function sendRequest() {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setUsers(data.users);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    }
    sendRequest();
  }, []);
  return (
    <Fragment>
      <ErrorModal error={error} onClear={() => {setError(null)}}/>
      {isLoading && (
        <div className="center">
          <LoadingSpinner/>
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>
  )
}