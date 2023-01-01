import React, { Fragment, useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

export default function UserPlaces() {
  const userId = useParams().userId;
  const [places, setPlaces] = useState(null);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  useEffect(() => {
    async function fetchPlaces() {
      try {
        const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/places/user/${userId}`);
        setPlaces(data.places)
      } catch (error) {
      }
    }
    fetchPlaces();
  }, [sendRequest, userId])

  function placeDeletedHandler(id) {
    setPlaces(prevPlaces => prevPlaces.filter(place => place._id !== id));
  }
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && places && <PlaceList items={places} onDelete={placeDeletedHandler}/>}
    </Fragment>
  )
}