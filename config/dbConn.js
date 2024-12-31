import { connect } from 'mongoose';

export const connectDatabase = async () => {
  try {
    await connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error(err);
  }
};
