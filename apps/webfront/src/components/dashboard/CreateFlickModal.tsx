import { css, cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import {
	CreateFlickFlickScopeEnumEnum,
	CreateNewFlickMutationVariables,
	useCreateNewFlickMutation,
} from 'src/graphql/generated'
import { Button, emitToast, Heading, TextField } from 'ui/src'

const defaults = {
	name: '',
	description: '',
	scope: CreateFlickFlickScopeEnumEnum.Public,
}

const CreateFlickModal = ({
	open,
	handleClose,
	seriesId,
	handleRefresh,
}: {
	open: boolean
	handleClose: (refetch?: boolean) => void
	seriesId?: string
	handleRefresh?: () => void
}) => {
	const [details, setDetails] =
		useState<CreateNewFlickMutationVariables>(defaults)

	const [createFlick, { data, loading }] = useCreateNewFlickMutation()

	const { push } = useRouter()

	const handleCreate = async () => {
		try {
			if (seriesId) {
				await createFlick({
					variables: {
						...details,
						seriesId,
					},
				})
			} else {
				await createFlick({ variables: details })
			}
		} catch (e) {
			emitToast('Could not create your flick.Please try again')
		}
	}

	useEffect(() => {
		if (!data) return
		push(`/story/${data.CreateFlick?.id}`)
		handleRefresh?.()
		emitToast('Flick created successfully')
	}, [data])

	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog
				className='relative z-50'
				onClose={() => {
					setDetails(defaults)
					handleClose(!!data)
				}}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/60' aria-hidden='true' />
				</Transition.Child>
				<div className='fixed inset-0 flex items-center justify-center p-4'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						<Dialog.Panel className='flex rounded-md flex-col max-w-[600px] w-full overflow-hidden bg-dark-100 p-4'>
							<div
								className={cx(
									'flex flex-col w-full',
									css`
										height: 50vh;
									`
								)}
							>
								<Heading className='py-2 text-gray-100' textStyle='mediumTitle'>
									Let&apos;s create a flick
								</Heading>

								<TextField
									label='Name your flick'
									value={details.name}
									onChange={e => {
										setDetails({ ...details, name: e.currentTarget.value })
									}}
									placeholder='Flick name'
									className='w-full border-none py-3 mt-1.5 focus:outline-none text-gray-100 text-sm'
								/>
								<span className='mt-4 text-size-xs font-bold tracking-wide text-gray-100 font-main'>
									Describe your flick
								</span>
								<textarea
									value={details.description ?? ''}
									onChange={e =>
										setDetails({
											...details,
											description: e.currentTarget.value,
										})
									}
									placeholder='Description (optional)'
									className='w-full bg-dark-400 border focus:bg-dark-300 border-transparent rounded-md py-3 px-3 mt-1.5 focus:ring-0 focus:border-green-600 text-gray-100 text-size-sm flex-1 resize-none'
								/>
								<Button
									className='mt-6 w-full max-w-none'
									size='large'
									loading={loading}
									disabled={!details.name || !!data}
									onClick={() => {
										if (!details.name) return
										handleCreate()
									}}
								>
									{data ? 'Redirecting you to studio...' : 'Create'}
								</Button>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}

export default CreateFlickModal
