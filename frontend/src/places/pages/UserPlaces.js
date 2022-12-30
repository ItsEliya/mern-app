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
        const data = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
        setPlaces(data.places)
      } catch (error) {
      }
    }
    fetchPlaces();
  }, [sendRequest, userId])
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && places && <PlaceList items={places}/>}
    </Fragment>
  )
}