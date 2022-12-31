import React from "react";
import Card from "../../shared/components/UI/Card";
import PlaceItem from "./PlaceItem";
import './PlaceList.css';
import Button from "../../shared/components/FormElements/Button";
export default function PlaceList(props) {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    )
  }

  return (
    <ul className="place-list">
      {props.items.map(place => <PlaceItem key={place._id} id={place._id} image={place.image} title={place.title} description={place.description} address={place.address} creatorId={place.creator} coordinates={place.location} onDelete={props.onDelete}/>)}
    </ul>
  )
}
