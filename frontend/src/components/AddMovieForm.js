import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';

const AddMovieForm = () => {
  const formik = useFormik({
    initialValues: { title: '', genre: '' },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      genre: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      console.log('Submitted:', values);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField
        label="Title"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <TextField
        label="Genre"
        name="genre"
        value={formik.values.genre}
        onChange={formik.handleChange}
        error={formik.touched.genre && Boolean(formik.errors.genre)}
        helperText={formik.touched.genre && formik.errors.genre}
      />
      <Button type="submit" variant="contained">Add Movie</Button>
    </Box>
  );
};

export default AddMovieForm;
