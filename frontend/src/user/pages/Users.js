import React from "react"
import UsersList from "../components/UsersList"
export default function Users() {
  const USERS = [
    {id: 'u1', name: 'Eliya Noah', image: 'https://images.pexels.com/photos/4033340/pexels-photo-4033340.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', places: 3}
  ];
  return (
    <UsersList items={USERS} />
  )
}