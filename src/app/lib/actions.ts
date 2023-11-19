'use server';

export async function runVocoder(prevState: any, formData: FormData) {
  console.log(formData)
  await new Promise(r => setTimeout(r, 2000));
  
  return {
    message: 'success'
  }
}