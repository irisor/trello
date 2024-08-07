export function TaskDetailsSidebar({ task }) {
	return (
		<section className="task-details-sidebar">
			<section className="task-details-sidebar-module-list">
				{!task.memberIds?.length && (
					<>
						<div className="task-details-sidebar-module-title with-btn">
							<h3 className="task-details-sidebar-module-title-text">Suggested</h3>
							<button className="btn"><span className="icon icon-sm icon-gear" /></button>
						</div>
						<section className="task-details-sidebar-module">
							<button className="btn join span1">
								<span className="icon icon-sm icon-member" />
								<p>Join</p>
							</button>
						</section>
					</>
				)}
			</section>
			<section className="task-details-sidebar-module-list">
				<h3 className="task-details-sidebar-module-title">Add to card</h3>
				<section className="task-details-sidebar-module">
					<button className="btn members span1">
						<span className="icon icon-sm icon-member" />
						<p>Members</p>
					</button>
					<button className="btn labels span1">
						<span className="icon icon-sm icon-label" />
						<p>Labels</p>
					</button>
					<button className="btn checklist span2">
						<span className="icon icon-sm icon-checklist" />
						<p>Checklist</p>
					</button>
					<button className="btn dates span1">
						<span className="icon icon-sm icon-clock" />
						<p>Dates</p>
					</button>
					<button className="btn attachment span2">
						<span className="icon icon-sm icon-attachment" />
						<p>Attachment</p>
					</button>
					<button className="btn cover span1">
						<span className="icon icon-sm icon-card-cover" />
						<p>Cover</p>
					</button>
					<button className="btn custom-fields span2">
						<span className="icon icon-sm icon-custom-field" />
						<p>Custom Fields</p>
					</button>
				</section>
			</section>
			<h3 className="task-details-sidebar-module-title">Power-Ups</h3>
			<section className="task-details-sidebar-module">
				<section className="task-details-sidebar-module-list">
					<button className="btn span1">
						<span className="icon icon-md icon-add" />
						<p>Add Power-Ups</p>
					</button>
				</section>
			</section>
			<div className="task-details-sidebar-module-title with-btn">
				<h3 className="task-details-sidebar-module-title-text">Automation</h3>
				<button className="btn"><span className="icon icon-sm icon-information" /></button>
			</div>
			<section className="task-details-sidebar-module">
				<section className="task-details-sidebar-module-list">
					<button className="btn span1">
						<span className="icon icon-md icon-add" />
						<p>Add button</p>
					</button>
				</section>
			</section>
			<h3 className="task-details-sidebar-module-title">Actions</h3>
			<section className="task-details-sidebar-module">
				<button className="btn">
					<span className="icon icon-sm icon-move" />
					<p>Move</p>
				</button>
				<button className="btn">
					<span className="icon icon-sm icon-copy" />
					<p>Copy</p>
				</button>
				<button className="btn">
					<span className="icon icon-sm icon-template-card" />
					<p>Make template</p>
				</button>
			</section>
			<hr></hr>
			<section className="task-details-sidebar-module">
				<button className="btn">
					<span className="icon icon-sm icon-archive" />
					<p>Archive</p>
				</button>
			</section>
			<section className="task-details-sidebar-module">
				<button className="btn">
					<span className="icon icon-sm icon-share" />
					<p>Share</p>
				</button>
			</section>
		</section>
	)
}