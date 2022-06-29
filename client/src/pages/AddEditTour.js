// We are Adding and Editing Tour in the same File

import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBValidation,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";

import ChipInput from "material-ui-chip-input";
import FileBase from "react-file-base64";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTour, updateTour } from "../redux/features/tourSlice";

/**************************************************************************************************/

const initialState = {
  title: "",
  description: "",
  tags: [],
};

const AddEditTour = () => {
  const [tourData, setTourData] = useState(initialState);
  const [tagErrMsg, setTagErrMsg] = useState(null);

  const { error, userTours } = useSelector((state) => ({
    ...state.tour,
  }));
  const { user } = useSelector((state) => ({ ...state.auth }));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { title, description, tags } = tourData;
  const { id } = useParams();

/**************************************************************************************************/

  useEffect(() => {
    if (id) {
      const singleTour = userTours.find((tour) => tour._id === id);
      console.log(singleTour);
      setTourData({ ...singleTour });
    }
  }, [id]);

/**************************************************************************************************/
  // It will run only when we have error and shows that error using toast

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

/**************************************************************************************************/
  // Submitting Form Details

  const handleSubmit = (e) => {
    e.preventDefault();

    // 
    if (!tags.length) {
      setTagErrMsg("Please provide some tags");
    }

    // If Title, Description and tags are present, then It will update(add Tour) tourData and also add User name to Database i.e., who created that tour
    if (title && description && tags) {
      const updatedTourData = { ...tourData, name: user?.result?.name };

      if (!id) {
        dispatch(createTour({ updatedTourData, navigate, toast }));
      } else {
        dispatch(updateTour({ id, updatedTourData, toast, navigate }));
      }
      handleClear();
    }
  };

/**************************************************************************************************/
  // Takes Input from User 

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setTourData({ ...tourData, [name]: value });
  };

/**************************************************************************************************/
  // Adding tags

  const handleAddTag = (tag) => {  // (tag) -> saving the tag
    setTagErrMsg(null);
    setTourData({ ...tourData, tags: [...tourData.tags, tag] });
  };

/**************************************************************************************************/
  // Deleting Tags

  const handleDeleteTag = (deleteTag) => {
    setTourData({
      ...tourData,
      tags: tourData.tags.filter((tag) => tag !== deleteTag),
    });
  };

/**************************************************************************************************/
  // Clearing(Reset) the Form
  const handleClear = () => {
    setTourData({ title: "", description: "", tags: [] });
  };

/**************************************************************************************************/

  return (
    
    <div
      style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "450px",
        alignContent: "center",
        marginTop: "120px",
      }}
      className="container"
    >

        <MDBCard alignment="center">

          <h5>{id ? "Update Tour" : "Add Tour"}</h5>

            <MDBCardBody>
                <MDBValidation onSubmit={handleSubmit} className="row g-3" noValidate>

                    <div className="col-md-12">
                      <MDBInput
                        label="Enter Title"
                        type="text"
                        value={title || ""}
                        name="title"
                        onChange={onInputChange}
                        className="form-control"
                        required
                        invalid
                        validation="Please provide title"
                      />
                    </div>


                    <div className="col-md-12">
                      <MDBInput
                        label="Enter Description"
                        type="text"
                        value={description}
                        name="description"
                        onChange={onInputChange}
                        className="form-control"
                        required
                        invalid
                        textarea
                        rows={4}
                        validation="Please provide description"
                      />
                    </div>


                    <div className="col-md-12">
                      <ChipInput
                        name="tags"
                        variant="outlined"
                        label="Enter Tag"
                        fullWidth
                        value={tags}
                        onAdd={(tag) => handleAddTag(tag)}
                        onDelete={(tag) => handleDeleteTag(tag)}
                      />
                      {tagErrMsg && <div className="tagErrMsg">{tagErrMsg}</div>}
                    </div>


                    <div className="d-flex justify-content-start">
                      <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) =>
                          setTourData({ ...tourData, imageFile: base64 })
                        }
                      />
                    </div>


                    <div className="col-12">
                      <MDBBtn style={{ width: "100%" }}>
                        {id ? "Update" : "Submit"}
                      </MDBBtn>

                      <MDBBtn
                        style={{ width: "100%" }}
                        className="mt-2"
                        color="danger"
                        onClick={handleClear}
                      >
                        Clear
                      </MDBBtn>
                    </div>

                </MDBValidation>
            </MDBCardBody>
        </MDBCard>
    </div>
  );
};

export default AddEditTour;
