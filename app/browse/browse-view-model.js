import { fromObject } from '@nativescript/core';
import { returnDate } from './browse-page';

export function BrowseViewModel() {
  const viewModel = fromObject({
    /* Add your view model properties here */
    maDate: returnDate()
  })

  return viewModel
}
