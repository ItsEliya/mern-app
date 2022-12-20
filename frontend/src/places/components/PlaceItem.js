import React, { Fragment, useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UI/Card";
import Modal from "../../shared/components/UI/Modal";
import Map from "../../shared/components/UI/Map";
import './PlaceItem.css';
import { AuthContext } from "../../shared/context/auth-context";
export default function PlaceItem(props) {
  const authCtx = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  function openMapHandler() {
    setShowMap(true);
  }
  function closeMapHandler() {
    setShowMap(false);
  }
  function openDeleteWarningHandler() {
    setShowDeleteWarning(true);
  }
  function closeDeleteWarningHandler() {
    setShowDeleteWarning(false);
  }
  function deletePlace() {
    setShowDeleteWarning(false);
  }
  return (
    <Fragment>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal show={showDeleteWarning} onCancel={closeDeleteWarningHandler} header="Warning" footerClass="place-item__modal-actions" footer={
        <Fragment>
          <Button inverse onClick={closeDeleteWarningHandler}>CANCEL</Button>
          <Button danger onClick={deletePlace}>DELETE</Button>
        </Fragment>
      }>
        <p>Are you sure you want to delete this place? Please note that it cannot be undone thereafter.</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {authCtx.isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {authCtx.isLoggedIn && <Button danger onClick={openDeleteWarningHandler}>DELETE</Button>}
          </div>
        </Card>
      </li>
    </Fragment>
  )
}