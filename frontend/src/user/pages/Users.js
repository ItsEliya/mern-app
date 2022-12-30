import React, { Fragment, useEffect, useState } from "react"
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UsersList from "../components/UsersList"
export default function Users() {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [users, setUsers] = useState(null);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await sendRequest("http://localhost:5000/api/users");
        setUsers(data.users);
      } catch (err) {
      }
    }
    fetchUsers();
  }, [sendRequest]);
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && (
        <div className="center">
          <LoadingSpinner/>
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>
  )
}